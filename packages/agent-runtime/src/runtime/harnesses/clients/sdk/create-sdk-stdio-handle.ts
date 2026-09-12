import { gracefulAcpSubprocessDisconnect } from '../graceful-acp-subprocess-disconnect.js';
import type { AcpClientHandle, PromptResult, SendPromptOptions } from '../acp-client.js';
import type { AcpSessionContext } from '../acp-session-context.js';
import type { AcpSessionTransport } from '../acp-session-transport.js';
import { sendAcpPromptViaTransport } from '../shared/send-acp-prompt-via-transport.js';
import {
  resolvePendingSdkStdioPermissionCancellations,
  resolveSdkStdioPermissionRequest,
} from './sdk-stdio-connection-client.js';
import type { SdkStdioPermissionPendingEntry } from './sdk-stdio-permission-pending.js';
import type { SdkStdioChild } from './spawn-sdk-stdio-process.js';

export function createSdkStdioHandle(options: {
  child: SdkStdioChild;
  sessionId: string;
  sessionCtx: AcpSessionContext;
  transport: AcpSessionTransport;
  pendingPermissionReplies: Map<string, SdkStdioPermissionPendingEntry>;
  killSubprocessAfterCancelMs?: number;
}): AcpClientHandle {
  let teardownStarted = false;

  async function disconnectGracefully(): Promise<void> {
    if (teardownStarted) return;
    teardownStarted = true;
    await gracefulAcpSubprocessDisconnect({
      child: options.child,
      sessionId: options.sessionId,
      transport: options.transport,
      resolvePendingPermissionCancellations: () =>
        resolvePendingSdkStdioPermissionCancellations(options.pendingPermissionReplies),
    });
  }

  return {
    sessionId: options.sessionId,
    async sendPrompt(prompt: string, sendOptions?: SendPromptOptions): Promise<PromptResult> {
      const imgs = sendOptions?.images?.map((im) => ({
        type: 'image' as const,
        mimeType: im.mimeType,
        data: im.dataBase64,
      }));
      return sendAcpPromptViaTransport(
        options.transport,
        options.sessionCtx,
        options.sessionId,
        prompt,
        imgs,
      );
    },
    async cancel() {
      resolvePendingSdkStdioPermissionCancellations(options.pendingPermissionReplies);
      try {
        await options.transport.cancelSession(options.sessionId);
      } catch {
        /* ignore */
      }
      if (options.killSubprocessAfterCancelMs != null && options.killSubprocessAfterCancelMs >= 0) {
        const t = setTimeout(() => {
          if (options.child.exitCode == null && options.child.signalCode == null) {
            void disconnectGracefully();
          }
        }, options.killSubprocessAfterCancelMs);
        t.unref?.();
      }
    },
    resolveRequest(requestId: string, result: unknown): void {
      resolveSdkStdioPermissionRequest(options.pendingPermissionReplies, requestId, result);
    },
    disconnectGracefully,
    disconnect() {
      void disconnectGracefully();
    },
  };
}
