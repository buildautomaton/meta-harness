import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { WorkItem } from '@/types/work/records.js';
import { run } from './sql.js';
import { isoNow } from './rank.js';
import { getWorkRow, nextQueued } from './read-work.js';
import { insertSession } from './sessions.js';

export function pickNext(db: SqlStore, sessionId: string): WorkItem | null {
  const next = nextQueued(db);
  if (!next) return null;
  const now = isoNow();
  run(db, 'UPDATE work SET status = ?, updated_at = ? WHERE id = ?', ['in_progress', now, next.id]);
  insertSession(db, { sessionId, workId: next.id, status: 'picked_up', createdAt: now });
  return getWorkRow(db, next.id);
}
