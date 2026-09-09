import type { CursorIncomingMethodDeps } from './cursor-incoming-cursor-methods.js';

/** Emit a normalized todos session update from cursor/update_todos params. */
export function emitCursorUpdateTodos(
  method: string,
  id: string | number | null,
  msg: Record<string, unknown>,
  deps: Pick<CursorIncomingMethodDeps, 'onSessionUpdate' | 'onRequest' | 'respond'>,
): void {
  const params = (msg.params as Record<string, unknown> | undefined) ?? {};
  const requestId = id != null ? String(id) : undefined;
  deps.onSessionUpdate?.({
    sessionUpdate: 'todos',
    kind: 'todos',
    method,
    ...(requestId ? { requestId } : {}),
    params,
    todos: params.todos ?? params.items ?? params,
  });
  if (requestId) {
    deps.onRequest?.({
      requestId,
      method,
      params,
    });
  }
  if (id != null) deps.respond(id, {});
}
