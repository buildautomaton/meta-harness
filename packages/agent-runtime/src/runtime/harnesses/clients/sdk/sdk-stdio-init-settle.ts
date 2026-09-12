import type { ChildProcess } from 'node:child_process';
import type { AcpClientHandle } from '../acp-client.js';
import { forceAcpSubprocessDisconnect } from '../graceful-acp-subprocess-disconnect.js';

export function createSdkStdioInitSettle(child: ChildProcess) {
  let initSettled = false;

  return {
    get settled(): boolean {
      return initSettled;
    },
    settleReject(reject: (err: Error) => void, err: Error): void {
      if (initSettled) return;
      initSettled = true;
      forceAcpSubprocessDisconnect(child);
      reject(err);
    },
    settleResolve(resolve: (handle: AcpClientHandle) => void, handle: AcpClientHandle): void {
      if (initSettled) return;
      initSettled = true;
      resolve(handle);
    },
  };
}
