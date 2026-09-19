import type { ChildProcess } from 'node:child_process';
import { killChildProcessTree } from './kill-process-tree.js';

/** Kill the ACP child when `signal` aborts (capability probes must not wait on a hung handshake). */
export function listenForAcpClientAbort(
  child: ChildProcess,
  signal: AbortSignal | undefined,
  onAbort: () => void,
): () => void {
  if (!signal) return () => {};
  const fire = () => {
    killChildProcessTree(child, 'SIGKILL');
    onAbort();
  };
  if (signal.aborted) {
    fire();
    return () => {};
  }
  signal.addEventListener('abort', fire, { once: true });
  return () => signal.removeEventListener('abort', fire);
}
