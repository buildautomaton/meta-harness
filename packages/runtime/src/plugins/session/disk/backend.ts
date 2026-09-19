import { join } from 'node:path';
import type { FileStore } from '@/types/file-store/implementation.js';
import type { SessionBackend } from '@runtime/session/types.js';
import type { SessionRecord } from '@/types/session/records.js';
import type { SessionCompactPayload } from '@/types/session/log.js';
import { diskPaths } from './paths.js';
import { appendEvent, readMeta, sessionEvents, writeJson, writeMarkdown } from './files.js';

/** Disk session store via a file-store plugin. */
export function createDiskBackend(dir: string, store: FileStore): SessionBackend {
  store.mkdir(dir);
  return {
    id: 'disk',
    create(record) {
      writeJson(store, diskPaths(dir, record.id).meta, record);
    },
    append(sessionId, event) {
      appendEvent(store, diskPaths(dir, sessionId).events, event);
    },
    patch(sessionId, patch) {
      const { meta } = diskPaths(dir, sessionId);
      const prev = readMeta(store, meta);
      if (!prev) return;
      writeJson(store, meta, { ...prev, ...patch, updatedAt: new Date().toISOString() });
    },
    get(sessionId) {
      const { meta, events } = diskPaths(dir, sessionId);
      const session = readMeta(store, meta);
      if (!session) return null;
      return { session, events: sessionEvents(store, session, events) };
    },
    compact(sessionId, payload: SessionCompactPayload) {
      const { meta, transcript, events } = diskPaths(dir, sessionId);
      const prev = readMeta(store, meta);
      if (prev) writeJson(store, meta, { ...prev, transcript: payload.transcript, log: payload.log });
      writeMarkdown(store, transcript, payload.transcript);
      store.remove(events);
    },
    list() {
      return store
        .list(dir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => readMeta(store, join(dir, name)))
        .filter((row): row is SessionRecord => row != null && typeof row.id === 'string');
    },
  };
}
