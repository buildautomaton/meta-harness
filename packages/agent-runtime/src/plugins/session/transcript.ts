import type { SessionEvent } from '@/types/session/records.js';

const SKIP_KIND = /tool_call|thought|reason|plan|todo|usage|config|command|user_message/i;
const MESSAGE_KIND = /agent_message|message_chunk|^message$/i;

export function compactAgentTranscript(events: SessionEvent[]): string {
  let out = '';
  let inMessage = false;
  for (const event of events) {
    const chunk = agentMessageChunk(event);
    if (chunk) {
      if (!inMessage && out) out += '\n\n';
      out += chunk;
      inMessage = true;
      continue;
    }
    if (event.kind === 'update') inMessage = false;
  }
  if (out.trim()) return out.trim();
  return resultOutput(events).trim();
}

export function transcriptTail(events: SessionEvent[], maxChars = 4000): string {
  const text = compactAgentTranscript(events);
  if (text.length <= maxChars) return text;
  return text.slice(text.length - maxChars);
}

function agentMessageChunk(event: SessionEvent): string {
  if (event.kind !== 'update') return '';
  const rec = asRecord(event.payload);
  if (!rec || rec.toolCall != null || rec.tool_call != null) return '';
  const kind = String(rec.sessionUpdate ?? rec.session_update ?? '');
  if (kind && SKIP_KIND.test(kind)) return '';
  if (kind && !MESSAGE_KIND.test(kind)) return '';
  return textFromContent(rec.content) || (typeof rec.text === 'string' ? rec.text : '');
}

function resultOutput(events: SessionEvent[]): string {
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event?.kind !== 'result') continue;
    const rec = asRecord(event.payload);
    if (typeof rec?.output === 'string' && rec.output.trim()) return rec.output;
    if (typeof rec?.error === 'string') return rec.error;
  }
  return '';
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function textFromContent(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(textFromContent).join('');
  const rec = asRecord(value);
  if (!rec) return '';
  const type = typeof rec.type === 'string' ? rec.type : '';
  if (/thought|reason/i.test(type)) return '';
  if (typeof rec.text === 'string') return rec.text;
  if (rec.content != null) return textFromContent(rec.content);
  return '';
}
