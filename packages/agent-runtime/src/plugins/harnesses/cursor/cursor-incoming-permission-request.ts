import type { JsonRpcRequestId, PendingRequest } from './cursor-json-rpc-types.js';

export function handleCursorIncomingPermissionRequest(
  id: JsonRpcRequestId,
  method: string,
  msg: Record<string, unknown>,
  deps: {
    onRequest?: (request: {
      requestId: string;
      method: string;
      params: Record<string, unknown>;
    }) => void;
    respond: (id: JsonRpcRequestId, result: unknown) => void;
    pendingRequests: Map<JsonRpcRequestId, PendingRequest>;
  },
): boolean {
  const params = (msg.params as Record<string, unknown> | undefined) ?? {};
  if (deps.onRequest) {
    deps.pendingRequests.set(id, { method, params });
    deps.onRequest({
      requestId: String(id),
      method,
      params,
    });
  } else {
    deps.respond(id, { outcome: { outcome: 'denied' as const } });
  }
  return true;
}
