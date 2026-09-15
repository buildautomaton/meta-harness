import type { SessionEvent } from '@/types/session/records.js';
import type { SessionLogEntry } from '@/types/session/log.js';
import { entryFromEvent } from './entry-from-event.js';

export function mergeSessionLog(log: SessionLogEntry[], event: SessionEvent): SessionLogEntry[] {
  const entry = entryFromEvent(event);
  if (!entry) return log;
  if ((entry.type === 'message' || entry.type === 'thought') && entry.text) {
    const last = log[log.length - 1];
    if (last?.type === entry.type) {
      return [...log.slice(0, -1), { ...last, text: `${last.text ?? ''}${entry.text}` }];
    }
  }
  if (entry.type === 'tool_call' && entry.toolCallId) {
    const idx = lastToolIndex(log, entry.toolCallId);
    if (idx >= 0) {
      const next = log.slice();
      next[idx] = mergeTool(log[idx]!, entry);
      return next;
    }
  }
  return [...log, stripEmpty(entry)];
}

export function compactSessionLog(events: SessionEvent[]): SessionLogEntry[] {
  return events.reduce((log, event) => mergeSessionLog(log, event), [] as SessionLogEntry[]);
}

export function markdownFromLog(log: SessionLogEntry[]): string {
  return log
    .filter((row) => row.type === 'message' && row.text?.trim())
    .map((row) => row.text!.trim())
    .join('\n\n');
}

function lastToolIndex(log: SessionLogEntry[], toolCallId: string): number {
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i]?.type === 'tool_call' && log[i]?.toolCallId === toolCallId) return i;
  }
  return -1;
}

function mergeTool(prev: SessionLogEntry, next: SessionLogEntry): SessionLogEntry {
  return stripEmpty({
    ...prev,
    ...Object.fromEntries(Object.entries(next).filter(([, value]) => value != null && value !== '')),
  });
}

function stripEmpty(entry: SessionLogEntry): SessionLogEntry {
  return Object.fromEntries(
    Object.entries(entry).filter(([, value]) => value != null && value !== ''),
  ) as SessionLogEntry;
}
