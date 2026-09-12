import type { SessionEvent } from '../../types/session/records.js';

const DEFAULT_TAIL = 4000;

function textFromUnknown(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null || typeof value !== 'object') return '';
  const rec = value as Record<string, unknown>;
  if (typeof rec.text === 'string') return rec.text;
  if (typeof rec.output === 'string') return rec.output;
  if (rec.content != null) return textFromUnknown(rec.content);
  if (Array.isArray(value)) return value.map(textFromUnknown).filter(Boolean).join('\n');
  return '';
}

function eventToText(event: SessionEvent): string {
  if (event.kind === 'result') {
    const rec = event.payload as { output?: string; error?: string; stopReason?: string };
    return rec.output ?? rec.error ?? rec.stopReason ?? '';
  }
  return textFromUnknown(event.payload);
}

/** Last portion of a session transcript for get_session summaries. */
export function transcriptTail(events: SessionEvent[], maxChars = DEFAULT_TAIL): string {
  const text = events
    .map(eventToText)
    .filter((line) => line.trim().length > 0)
    .join('\n');
  if (text.length <= maxChars) return text;
  return text.slice(text.length - maxChars);
}
