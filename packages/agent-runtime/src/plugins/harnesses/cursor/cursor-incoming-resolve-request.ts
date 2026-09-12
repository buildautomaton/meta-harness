import { enrichAcpPermissionRpcResultFromRequestParams } from '../../../runtime/harnesses/permission/enrich-acp-permission-rpc-result.js';
import { enrichCreatePlanRpcResult } from './enrich-create-plan-rpc-result.js';
import {
  isAcceptedCreatePlanRpcResult,
  markPendingPlanExecute,
  type PendingPlanExecuteRef,
} from './cursor-plan-continue.js';
import type { JsonRpcRequestId, PendingRequest } from './cursor-json-rpc-types.js';

export function resolveCursorIncomingRequest(
  pendingRequests: Map<JsonRpcRequestId, PendingRequest>,
  respond: (id: JsonRpcRequestId, result: unknown) => void,
  requestId: JsonRpcRequestId,
  result: unknown,
  acpSessionId?: string | null,
  pendingPlanExecute?: PendingPlanExecuteRef,
): void {
  const pending = pendingRequests.get(requestId);
  let payload = result;
  if (pending?.method === 'session/request_permission') {
    payload = enrichAcpPermissionRpcResultFromRequestParams(result, pending.params);
  } else if (pending?.method === 'cursor/create_plan') {
    payload = enrichCreatePlanRpcResult(result, pending.params, acpSessionId ?? undefined);
    if (isAcceptedCreatePlanRpcResult(payload)) markPendingPlanExecute(pendingPlanExecute);
  }
  respond(requestId, payload);
  pendingRequests.delete(requestId);
}
