import type { ChildProcess } from 'node:child_process';
import treeKill from 'tree-kill';

/** Grace after SIGTERM before SIGKILL when tearing down an ACP subprocess tree. */
export const ACP_PROCESS_TREE_KILL_GRACE_MS = 2_500;

/** Kill `pid` and its descendants via `tree-kill` (no detached spawn). */
export function killProcessTreeSync(pid: number, signal: NodeJS.Signals = 'SIGTERM'): void {
  if (!Number.isFinite(pid) || pid <= 0) return;
  treeKill(pid, signal);
}

export async function killProcessTree(
  pid: number,
  signal: NodeJS.Signals = 'SIGTERM',
): Promise<void> {
  if (!Number.isFinite(pid) || pid <= 0) return;
  await new Promise<void>((resolve) => {
    treeKill(pid, signal, () => resolve());
  });
}

export function killChildProcessTree(
  child: ChildProcess,
  signal: NodeJS.Signals = 'SIGTERM',
): void {
  const pid = child.pid;
  if (pid != null) {
    killProcessTreeSync(pid, signal);
    return;
  }
  try {
    child.kill(signal);
  } catch {
    /* ignore */
  }
}

export async function killChildProcessTreeGracefully(
  child: ChildProcess,
  graceMs: number = ACP_PROCESS_TREE_KILL_GRACE_MS,
): Promise<void> {
  const pid = child.pid;
  if (pid == null) {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
    return;
  }
  await killProcessTree(pid, 'SIGTERM');
  if (graceMs <= 0) return;
  const exited = new Promise<void>((resolve) => {
    child.once('exit', () => resolve());
  });
  await Promise.race([exited, new Promise<void>((resolve) => setTimeout(resolve, graceMs))]);
  if (child.exitCode == null && child.signalCode == null) {
    await killProcessTree(pid, 'SIGKILL');
  }
}
