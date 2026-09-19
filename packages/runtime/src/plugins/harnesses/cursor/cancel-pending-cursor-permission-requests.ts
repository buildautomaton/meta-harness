import type { JsonRpcRequestId, PendingRequest } from './cursor-json-rpc-types.js';

export function cancelPendingCursorPermissionRequests(
  pendingRequests: Map<JsonRpcRequestId, PendingRequest>,
  respond: (id: JsonRpcRequestId, result: unknown) => void,
): void {
  for (const [reqId, pending] of [...pendingRequests.entries()]) {
    if (pending.method === 'session/request_permission') {
      respond(reqId, { outcome: { outcome: 'cancelled' } });
      pendingRequests.delete(reqId);
    }
  }
}
