import { enrichAcpPermissionRpcResultFromRequestParams } from '../../permission/enrich-acp-permission-rpc-result.js';
import type { AcpClientOptions } from '../acp-client.js';
import type { AcpSessionContext } from '../acp-session-context.js';
import { acpReadTextFileInProcess, acpWriteTextFileInProcess } from '../shared/acp-fs-read-write.js';
import { dispatchAcpSessionUpdate } from '../shared/dispatch-session-update.js';
import { flattenSdkSessionNotificationParams } from '../shared/flatten-sdk-session-notification.js';
import { createSdkStdioExtNotificationHandler } from './sdk-stdio-ext-notifications.js';
import { awaitSdkStdioPermissionRequestHandshake } from './sdk-stdio-permission-request-handshake.js';
import {
  resolvePendingSdkStdioPermissionCancellations,
  type SdkStdioPermissionPendingEntry,
} from './sdk-stdio-permission-pending.js';

export type SdkStdioConnectionClientDeps = {
  backendAgentType?: string | null;
  onSessionUpdate?: AcpClientOptions['onSessionUpdate'];
  onRequest?: AcpClientOptions['onRequest'];
  sessionCtx: AcpSessionContext;
  pendingPermissionReplies: Map<string, SdkStdioPermissionPendingEntry>;
  createExtNotificationHandler?: AcpClientOptions['createExtNotificationHandler'];
};

export function createSdkStdioConnectionClient(deps: SdkStdioConnectionClientDeps) {
  const { onSessionUpdate, onRequest, sessionCtx, pendingPermissionReplies, createExtNotificationHandler } =
    deps;

  const extNotification =
    createExtNotificationHandler?.({ onSessionUpdate }) ??
    createSdkStdioExtNotificationHandler({ onSessionUpdate });

  let permissionSeq = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ACP SDK Client shape; handlers match runtime contract.
  return (_agent: any) => ({
    async requestPermission(params: any) {
      const requestId = `perm-${++permissionSeq}`;
      const paramsRecord =
        params != null && typeof params === 'object' ? (params as Record<string, unknown>) : {};
      return await awaitSdkStdioPermissionRequestHandshake({
        requestId,
        paramsRecord,
        pending: pendingPermissionReplies,
        onRequest,
      });
    },
    async readTextFile(params: { path: string; line?: number | null; limit?: number | null }) {
      return acpReadTextFileInProcess(sessionCtx, params.path, params.line, params.limit);
    },
    async writeTextFile(params: { path: string; content: string }) {
      return acpWriteTextFileInProcess(sessionCtx, params.path, params.content);
    },
    async sessionUpdate(params: { sessionId: string; update: Record<string, unknown> }) {
      const bridged = flattenSdkSessionNotificationParams(params);
      dispatchAcpSessionUpdate({
        flatPayload: bridged,
        onAcpConfigOptionsUpdated: sessionCtx.onAcpConfigOptionsUpdated,
        onAcpAvailableCommandsUpdated: sessionCtx.onAcpAvailableCommandsUpdated,
        onSessionUpdate,
        suppressLoadReplay: () => sessionCtx.suppressLoadReplay.value,
      });
    },
    async extNotification(method: string, params: unknown) {
      await extNotification(method, params);
    },
  });
}

export function resolveSdkStdioPermissionRequest(
  pendingPermissionReplies: Map<string, SdkStdioPermissionPendingEntry>,
  requestId: string,
  result: unknown,
): void {
  const entry = pendingPermissionReplies.get(requestId);
  if (!entry) return;
  pendingPermissionReplies.delete(requestId);
  const enriched = enrichAcpPermissionRpcResultFromRequestParams(result, entry.params);
  entry.resolve(enriched);
}

export { resolvePendingSdkStdioPermissionCancellations };
