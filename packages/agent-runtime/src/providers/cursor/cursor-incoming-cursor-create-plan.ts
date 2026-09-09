import type { JsonRpcRequestId, PendingRequest } from './cursor-json-rpc-types.js';

/** Build a synthetic tool_call_update from Cursor's blocking cursor/create_plan request. */
export function buildCursorCreatePlanToolCallUpdate(
  requestId: string,
  params: Record<string, unknown>,
): Record<string, unknown> | null {
  const toolCallId = params.toolCallId ?? params.tool_call_id;
  if (typeof toolCallId !== 'string' || !toolCallId.trim()) return null;

  const name = typeof params.name === 'string' ? params.name.trim() : '';
  const overview = typeof params.overview === 'string' ? params.overview : undefined;
  const plan = typeof params.plan === 'string' ? params.plan : '';
  const todos = Array.isArray(params.todos) ? params.todos : undefined;
  const phases = Array.isArray(params.phases) ? params.phases : undefined;
  const isProject = typeof params.isProject === 'boolean' ? params.isProject : undefined;

  return {
    sessionUpdate: 'tool_call',
    toolCallId,
    title: name || 'Plan',
    status: 'pending',
    cursorPlan: {
      requestId,
      ...(name ? { name } : {}),
      ...(overview != null ? { overview } : {}),
      plan,
      ...(todos != null ? { todos } : {}),
      ...(phases != null ? { phases } : {}),
      ...(isProject != null ? { isProject } : {}),
    },
  };
}

export function queueCursorCreatePlanRequest(
  method: string,
  id: JsonRpcRequestId,
  msg: Record<string, unknown>,
  deps: {
    onRequest?: (request: {
      requestId: string;
      method: string;
      params: Record<string, unknown>;
    }) => void;
    onSessionUpdate?: (params: unknown) => void;
    pendingRequests: Map<JsonRpcRequestId, PendingRequest>;
  },
): void {
  const params = (msg.params as Record<string, unknown> | undefined) ?? {};
  const requestId = String(id);
  deps.pendingRequests.set(id, { method, params });
  const update = buildCursorCreatePlanToolCallUpdate(requestId, params);
  if (update) deps.onSessionUpdate?.(update);
  deps.onRequest?.({ requestId, method, params });
}
