import type { JsonRpcRequestId, PendingRequest } from './cursor-json-rpc-types.js';
import { queueCursorCreatePlanRequest } from './cursor-incoming-cursor-create-plan.js';
import { handleCursorIncomingCursorTask } from './cursor-incoming-cursor-task.js';
import { emitCursorUpdateTodos } from './emit-cursor-update-todos.js';

const CURSOR_BRIDGE_METHODS = new Set(['cursor/ask_question']);

export type CursorIncomingMethodDeps = {
  onRequest?: (request: {
    requestId: string;
    method: string;
    params: Record<string, unknown>;
  }) => void;
  onSessionUpdate?: (params: unknown) => void;
  respond: (id: JsonRpcRequestId, result: unknown) => void;
  pendingRequests: Map<JsonRpcRequestId, PendingRequest>;
};

/** Fire-and-forget Cursor methods (no JSON-RPC id). */
export function handleCursorIncomingCursorNotification(
  method: string,
  msg: Record<string, unknown>,
  onSessionUpdate?: (params: unknown) => void,
): boolean {
  if (method === 'cursor/task') {
    handleCursorIncomingCursorTask(null, msg, { onSessionUpdate });
    return true;
  }
  if (method === 'cursor/update_todos') {
    emitCursorUpdateTodos(method, null, msg, {
      onSessionUpdate,
      respond: () => {},
    });
    return true;
  }
  if (method === 'cursor/generate_image') return true;
  return false;
}

export function handleCursorIncomingCursorMethods(
  method: string,
  id: JsonRpcRequestId,
  msg: Record<string, unknown>,
  deps: CursorIncomingMethodDeps,
): boolean {
  if (method === 'cursor/create_plan') {
    queueCursorCreatePlanRequest(method, id, msg, deps);
    return true;
  }

  if (CURSOR_BRIDGE_METHODS.has(method)) {
    const params = (msg.params as Record<string, unknown> | undefined) ?? {};
    deps.pendingRequests.set(id, { method, params });
    deps.onRequest?.({
      requestId: String(id),
      method,
      params,
    });
    return true;
  }

  if (method === 'cursor/task') {
    handleCursorIncomingCursorTask(id, msg, deps);
    return true;
  }

  if (method === 'cursor/update_todos') {
    emitCursorUpdateTodos(method, id, msg, deps);
    return true;
  }

  if (method === 'cursor/generate_image') {
    deps.respond(id, {});
    return true;
  }

  return false;
}
