import type { SessionEvent } from '../../types/session/records.js';
import type { SessionLogEntry } from '../../types/session/log.js';

export function entryFromEvent(event: SessionEvent): SessionLogEntry | undefined {
  if (event.kind === 'result') return resultEntry(event.payload);
  if (event.kind === 'request') {
    return { type: 'request', text: requestText(event.payload) };
  }
  if (event.kind !== 'update') return undefined;
  const rec = asRecord(event.payload);
  if (!rec) return undefined;
  const kind = String(rec.sessionUpdate ?? rec.session_update ?? '');
  if (/thought|reason/i.test(kind)) return textEntry('thought', rec);
  if (/tool_call/i.test(kind) || rec.toolCall != null || rec.tool_call != null) return toolEntry(rec);
  if (!kind || /agent_message|message_chunk|^message$/i.test(kind)) return textEntry('message', rec);
  return undefined;
}

function textEntry(type: 'message' | 'thought', rec: Record<string, unknown>): SessionLogEntry | undefined {
  const text = contentText(rec.content) || (typeof rec.text === 'string' ? rec.text : '');
  return text ? { type, text } : undefined;
}

function toolEntry(rec: Record<string, unknown>): SessionLogEntry {
  const nested = asRecord(rec.toolCall) ?? asRecord(rec.tool_call) ?? {};
  const id = str(rec.toolCallId) ?? str(rec.tool_call_id) ?? str(nested.toolCallId) ?? str(nested.id);
  return {
    type: 'tool_call',
    ...(id ? { toolCallId: id } : {}),
    name: str(rec.name) ?? str(nested.name),
    title: str(rec.title) ?? str(nested.title),
    kind: str(rec.kind) ?? str(nested.kind),
    status: str(rec.status) ?? str(nested.status),
    input: rec.rawInput ?? nested.rawInput ?? rec.input ?? nested.input,
    output: rec.rawOutput ?? nested.rawOutput ?? rec.output ?? nested.output ?? rec.content,
  };
}

function resultEntry(payload: unknown): SessionLogEntry {
  const rec = asRecord(payload) ?? {};
  return {
    type: 'result',
    success: rec.success === true,
    text: typeof rec.output === 'string' ? rec.output : undefined,
    error: typeof rec.error === 'string' ? rec.error : undefined,
  };
}

function requestText(payload: unknown): string {
  const rec = asRecord(payload) ?? {};
  const inner = asRecord(rec.payload) ?? {};
  return str(rec.method) ?? str(inner.method) ?? 'request';
}

function contentText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(contentText).join('');
  const rec = asRecord(value);
  if (!rec) return '';
  if (/thought|reason/i.test(String(rec.type ?? ''))) return '';
  if (typeof rec.text === 'string') return rec.text;
  return rec.content != null ? contentText(rec.content) : '';
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
