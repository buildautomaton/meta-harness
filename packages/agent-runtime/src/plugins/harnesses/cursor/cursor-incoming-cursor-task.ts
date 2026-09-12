import type { JsonRpcRequestId } from './cursor-json-rpc-types.js';

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

/** Cursor may nest Task fields under `task` / `data` instead of the params root. */
export function flattenCursorTaskParams(params: Record<string, unknown>): Record<string, unknown> {
  const nested =
    asRecord(params.task) ?? asRecord(params.data) ?? asRecord(params.payload) ?? asRecord(params.cursorTask);
  return nested ? { ...nested, ...params } : params;
}

function stringField(params: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = params[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
}

/** Build a synthetic tool_call_update from Cursor's cursor/task notification. */
export function buildCursorTaskToolCallUpdate(
  rawParams: Record<string, unknown>,
): Record<string, unknown> | null {
  const params = flattenCursorTaskParams(rawParams);
  const toolCallId = params.toolCallId ?? params.tool_call_id;
  if (typeof toolCallId !== 'string' || !toolCallId.trim()) return null;

  const description = stringField(params, 'description');
  const prompt = typeof params.prompt === 'string' ? params.prompt : undefined;
  const subagentType = params.subagentType ?? params.subagent_type;
  const model = typeof params.model === 'string' ? params.model : undefined;
  const agentId = stringField(params, 'agentId', 'agent_id');
  const rawDuration = params.durationMs ?? params.duration_ms;
  const durationMs =
    typeof rawDuration === 'number' && Number.isFinite(rawDuration) && rawDuration > 0
      ? rawDuration
      : undefined;
  const isBackground =
    typeof params.isBackground === 'boolean'
      ? params.isBackground
      : typeof params.is_background === 'boolean'
        ? params.is_background
        : typeof params.runInBackground === 'boolean'
          ? params.runInBackground
          : typeof params.run_in_background === 'boolean'
            ? params.run_in_background
            : undefined;

  return {
    sessionUpdate: 'tool_call_update',
    toolCallId,
    ...(description ? { title: description } : {}),
    cursorTask: {
      ...(description ? { description } : {}),
      ...(prompt != null ? { prompt } : {}),
      ...(subagentType != null ? { subagentType } : {}),
      ...(model != null ? { model } : {}),
      ...(agentId != null ? { agentId } : {}),
      ...(durationMs != null ? { durationMs } : {}),
      ...(isBackground != null ? { isBackground } : {}),
    },
  };
}

export function handleCursorIncomingCursorTask(
  id: JsonRpcRequestId | null | undefined,
  msg: Record<string, unknown>,
  deps: {
    respond?: (id: JsonRpcRequestId, result: unknown) => void;
    onSessionUpdate?: (params: unknown) => void;
  },
): void {
  if (id != null) deps.respond?.(id, {});
  const params = (msg.params as Record<string, unknown> | undefined) ?? {};
  const update = buildCursorTaskToolCallUpdate(params);
  if (update) deps.onSessionUpdate?.(update);
}
