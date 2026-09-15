import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { SessionBackend } from '@runtime/session/types.js';
import type { SessionRecord } from '@/types/session/records.js';
import type { SessionCompactPayload } from '@/types/session/log.js';
import { diskPaths } from './paths.js';
import { appendEvent, readMeta, sessionEvents, unlinkIfExists, writeJson, writeMarkdown } from './files.js';

/** Disk session store: `{id}.jsonl` while running; compact to `{id}.md` + structured `{id}.json` log. */
export function createDiskBackend(dir: string): SessionBackend {
  mkdirSync(dir, { recursive: true });
  return {
    id: 'disk',
    create(record) {
      writeJson(diskPaths(dir, record.id).meta, record);
    },
    append(sessionId, event) {
      appendEvent(diskPaths(dir, sessionId).events, event);
    },
    patch(sessionId, patch) {
      const { meta } = diskPaths(dir, sessionId);
      const prev = readMeta(meta);
      if (!prev) return;
      writeJson(meta, { ...prev, ...patch, updatedAt: new Date().toISOString() });
    },
    get(sessionId) {
      const { meta, events } = diskPaths(dir, sessionId);
      const session = readMeta(meta);
      if (!session) return null;
      return { session, events: sessionEvents(session, events) };
    },
    compact(sessionId, payload: SessionCompactPayload) {
      const { meta, transcript, events } = diskPaths(dir, sessionId);
      const prev = readMeta(meta);
      if (prev) writeJson(meta, { ...prev, transcript: payload.transcript, log: payload.log });
      writeMarkdown(transcript, payload.transcript);
      unlinkIfExists(events);
    },
    list() {
      return readdirSync(dir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => readMeta(join(dir, name)))
        .filter((row): row is SessionRecord => row != null && typeof row.id === 'string');
    },
  };
}
