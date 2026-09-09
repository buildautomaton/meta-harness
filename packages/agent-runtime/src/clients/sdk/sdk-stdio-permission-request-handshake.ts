import type { AcpClientOptions } from '../acp-client.js';

export type PendingPermissionReplyEntry = {
  resolve: (result: unknown) => void;
  params: Record<string, unknown>;
};

export type PendingPermissionReplyMap = Map<string, PendingPermissionReplyEntry>;

/**
 * Same ordering as {@link createSdkStdioAcpClient} `requestPermission`: register the pending row,
 * then call `onRequest`. Synchronous `onRequest` handlers (CLI dangerous auto-approve) may call
 * `resolveRequest` in the same tick; they rely on the map entry already existing.
 */
export function awaitSdkStdioPermissionRequestHandshake(params: {
  requestId: string;
  paramsRecord: Record<string, unknown>;
  pending: PendingPermissionReplyMap;
  onRequest?: NonNullable<AcpClientOptions['onRequest']>;
}): Promise<unknown> {
  const { requestId, paramsRecord, pending, onRequest } = params;
  return new Promise<unknown>((resolve) => {
    pending.set(requestId, { resolve, params: paramsRecord });
    if (onRequest == null) {
      pending.delete(requestId);
      resolve({ outcome: { outcome: 'denied' as const } });
      return;
    }
    try {
      onRequest({
        requestId,
        method: 'session/request_permission',
        params: paramsRecord,
      });
    } catch {
      /* bridge forward failed — still wait for resolveRequest or cancel */
    }
  });
}
