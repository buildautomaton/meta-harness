import { appendFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import type { SessionEvent, SessionRecord } from '../../../types/session/records.js';
import { logToEvents } from '../log-to-events.js';

export function readMeta(path: string): SessionRecord | null {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as SessionRecord;
  } catch {
    return null;
  }
}

export function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeMarkdown(path: string, text: string): void {
  if (!text.trim()) return;
  writeFileSync(path, text.endsWith('\n') ? text : `${text}\n`);
}

export function appendEvent(path: string, event: SessionEvent): void {
  appendFileSync(path, `${JSON.stringify(event)}\n`);
}

export function unlinkIfExists(path: string): void {
  if (existsSync(path)) unlinkSync(path);
}

export function sessionEvents(session: SessionRecord, eventsPath: string): SessionEvent[] {
  if (existsSync(eventsPath)) {
    return readFileSync(eventsPath, 'utf8')
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
