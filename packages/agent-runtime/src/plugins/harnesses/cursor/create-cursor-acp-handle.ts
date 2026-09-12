import { killChildProcessTreeGracefully } from '../../../runtime/harnesses/clients/kill-process-tree.js';
import type { AcpClientHandle, PromptResult, SendPromptOptions } from '../../../runtime/harnesses/clients/acp-client.js';
import type { AcpSessionContext } from '../../../runtime/harnesses/clients/acp-session-context.js';
import type { AcpSessionTransport } from '../../../runtime/harnesses/clients/acp-session-transport.js';
import { sendCursorPromptWithPlanContinue } from './send-cursor-prompt-with-plan-continue.js';
import { cancelPendingCursorPermissionRequests } from './cancel-pending-cursor-permission-requests.js';
import type { createCursorAcpIncomingLineHandler } from './cursor-acp-incoming-line-handler.js';
import type { createCursorJsonRpcWriter } from './cursor-json-rpc-wire.js';
import type { JsonRpcRequestId, PendingRequest } from './cursor-json-rpc-types.js';
import type { CursorAcpChild } from './spawn-cursor-acp-process.js';

export function createCursorAcpHandle(options: {
  child: CursorAcpChild;
  sessionId: string;
  sessionCtx: AcpSessionContext;
  transport: AcpSessionTransport;
  wire: ReturnType<typeof createCursorJsonRpcWriter>;
  incoming: ReturnType<typeof createCursorAcpIncomingLineHandler>;
  pendingRequests: Map<JsonRpcRequestId, PendingRequest>;
}): AcpClientHandle {
  let teardownStarted = false;
  let cancelFallback: ReturnType<typeof setTimeout> | null = null;

  async function disconnectGracefully(): Promise<void> {
    if (teardownStarted) return;
    teardownStarted = true;
    if (cancelFallback) clearTimeout(cancelFallback);
    cancelFallback = null;
    cancelPendingCursorPermissionRequests(options.pendingRequests, options.wire.respond);
    try {
      await options.transport.cancelSession(options.sessionId);
    } catch {
      /* ignore */
    }
    await killChildProcessTreeGracefully(options.child);
  }

  return {
    sessionId: options.sessionId,
    async sendPrompt(prompt: string, sendOptions?: SendPromptOptions): Promise<PromptResult> {
      const imgs = sendOptions?.images?.map((im) => ({
        type: 'image' as const,
        mimeType: im.mimeType,
        data: im.dataBase64,
      }));
      return sendCursorPromptWithPlanContinue({
        transport: options.transport,
        sessionCtx: options.sessionCtx,
        sessionId: options.sessionId,
        prompt,
        images: imgs,
      });
    },
    async cancel() {
      cancelPendingCursorPermissionRequests(options.pendingRequests, options.wire.respond);
      try {
        await options.transport.cancelSession(options.sessionId);
      } catch {
        /* The fallback below must still release a Cursor prompt that ignores cancellation. */
      }
      if (cancelFallback) return;
      cancelFallback = setTimeout(() => {
        if (options.child.exitCode == null && options.child.signalCode == null) {
          void disconnectGracefully();
        }
      }, 5000);
      cancelFallback.unref?.();
    },
    resolveRequest(requestId: string, result: unknown): void {
      if (options.pendingRequests.has(requestId)) {
        options.incoming.resolveRequest(requestId, result);
        return;
      }
      const numericId = Number(requestId);
      if (Number.isFinite(numericId) && options.pendingRequests.has(numericId)) {
        options.incoming.resolveRequest(numericId, result);
      }
    },
    disconnectGracefully,
    disconnect() {
      void disconnectGracefully();
    },
  };
}
