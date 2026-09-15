import type { SessionEvent } from '@/types/session/records.js';
import type { SessionLogEntry } from '@/types/session/log.js';

export function logToEvents(log: SessionLogEntry[]): SessionEvent[] {
  return log.map((row, index) => ({
    ts: String(index),
    kind: row.type === 'result' ? 'result' : row.type === 'request' ? 'request' : 'update',
    payload: payload(row),
  }));
}

function payload(row: SessionLogEntry): unknown {
  if (row.type === 'message') {
    return { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: row.text ?? '' } };
  }
  if (row.type === 'thought') {
    return { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text: row.text ?? '' } };
  }
  if (row.type === 'tool_call') {
    return {
      sessionUpdate: 'tool_call',
      toolCallId: row.toolCallId,
      name: row.name,
      title: row.title,
      kind: row.kind,
      status: row.status,
      rawInput: row.input,
      rawOutput: row.output,
    };
  }
  if (row.type === 'result') {
    return { success: row.success, output: row.text, error: row.error };
  }
  return { method: row.text };
}
