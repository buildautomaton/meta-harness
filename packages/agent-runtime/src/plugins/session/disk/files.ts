import type { FileStore } from '@/types/file-store/implementation.js';
import type { SessionEvent, SessionRecord } from '@/types/session/records.js';
import { logToEvents } from '@plugins/session/log-to-events.js';

export function readMeta(store: FileStore, path: string): SessionRecord | null {
  try {
    const text = store.read(path);
    return text ? (JSON.parse(text) as SessionRecord) : null;
  } catch {
    return null;
  }
}

export function writeJson(store: FileStore, path: string, value: unknown): void {
  store.write(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeMarkdown(store: FileStore, path: string, text: string): void {
  if (!text.trim()) return;
  store.write(path, text.endsWith('\n') ? text : `${text}\n`);
}

export function appendEvent(store: FileStore, path: string, event: SessionEvent): void {
  store.append(path, `${JSON.stringify(event)}\n`);
}

export function sessionEvents(store: FileStore, session: SessionRecord, eventsPath: string): SessionEvent[] {
  if (store.exists(eventsPath)) {
    return (store.read(eventsPath) ?? '')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SessionEvent);
  }
  if (session.log?.length) return logToEvents(session.log);
  if (session.transcript?.trim()) {
    return [{ ts: session.updatedAt, kind: 'result', payload: { output: session.transcript } }];
  }
  return [];
}
