import type { Database } from 'node-sqlite3-wasm';
import type { WorkItem } from '@/types/work/records.js';
import { run } from './sql.js';
import { isoNow } from './rank.js';
import { listWorkRows, getWorkRow } from './read-work.js';
import { insertSession } from './sessions.js';

export function pickNext(db: Database, sessionId: string): WorkItem | null {
  const next = listWorkRows(db, 'draft')[0];
  if (!next) return null;
  const now = isoNow();
  run(db, 'UPDATE work SET status = ?, updated_at = ? WHERE id = ?', ['in_progress', now, next.id]);
  insertSession(db, { sessionId, workId: next.id, status: 'picked_up', createdAt: now });
  return getWorkRow(db, next.id);
}
