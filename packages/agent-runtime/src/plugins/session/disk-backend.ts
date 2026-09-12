import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  appendFileSync,
  existsSync,
} from 'node:fs';
import { join } from 'node:path';
import type { SessionBackend } from '../../runtime/session/types.js';
import type { SessionEvent, SessionRecord } from '../../types/session/records.js';

function paths(dir: string, id: string) {
  return { meta: join(dir, `${id}.json`), events: join(dir, `${id}.jsonl`) };
}

function readJson(path: string): SessionRecord | null {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as SessionRecord;
  } catch {
    return null;
  }
}

function readEvents(path: string): SessionEvent[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SessionEvent);
}

/** Disk session store: `{id}.json` metadata + `{id}.jsonl` transcript. */
export function createDiskBackend(dir: string): SessionBackend {
  mkdirSync(dir, { recursive: true });
  return {
    id: 'disk',
    create(record) {
      const { meta } = paths(dir, record.id);
      writeFileSync(meta, `${JSON.stringify(record, null, 2)}\n`);
    },
    append(sessionId, event) {
      const { events } = paths(dir, sessionId);
      appendFileSync(events, `${JSON.stringify(event)}\n`);
    },
    patch(sessionId, patch) {
      const { meta } = paths(dir, sessionId);
      const prev = readJson(meta);
      if (!prev) return;
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      writeFileSync(meta, `${JSON.stringify(next, null, 2)}\n`);
    },
    get(sessionId) {
      const { meta, events } = paths(dir, sessionId);
      const session = readJson(meta);
      if (!session) return null;
      return { session, events: readEvents(events) };
    },
    list() {
      return readdirSync(dir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => readJson(join(dir, name)))
        .filter((row): row is SessionRecord => row != null);
    },
  };
}
