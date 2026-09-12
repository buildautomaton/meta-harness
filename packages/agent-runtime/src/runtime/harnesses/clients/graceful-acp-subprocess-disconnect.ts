import type { ChildProcess } from 'node:child_process';
import type { AcpSessionTransport } from './acp-session-transport.js';
import {
  ACP_PROCESS_TREE_KILL_GRACE_MS,
  killChildProcessTreeGracefully,
  killChildProcessTree,
} from './kill-process-tree.js';

/** Wait after `session/close` before SIGTERM on the subprocess tree. */
export const ACP_GRACEFUL_SESSION_CLOSE_WAIT_MS = 1_500;

export async function gracefulAcpSubprocessDisconnect(params: {
  child: ChildProcess;
  sessionId: string;
  transport: AcpSessionTransport;
  resolvePendingPermissionCancellations?: () => void;
  /** When false, skip wire close (init failed or connection already dead). */
  wireClose?: boolean;
}): Promise<void> {
  const { child, sessionId, transport, resolvePendingPermissionCancellations, wireClose = true } =
    params;

  if (child.exitCode != null || child.signalCode != null) return;

  resolvePendingPermissionCancellations?.();

  if (wireClose) {
    try {
      await transport.closeSession?.(sessionId);
    } catch {
      /* agent may not support session/close or connection already closed */
    }
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, ACP_GRACEFUL_SESSION_CLOSE_WAIT_MS);
      timer.unref?.();
    });
  }

  if (child.exitCode != null || child.signalCode != null) return;
  await killChildProcessTreeGracefully(child, ACP_PROCESS_TREE_KILL_GRACE_MS);
}

/** Immediate tree kill when graceful close is not possible (startup failure, abort). */
export function forceAcpSubprocessDisconnect(child: ChildProcess): void {
  killChildProcessTree(child, 'SIGKILL');
}
