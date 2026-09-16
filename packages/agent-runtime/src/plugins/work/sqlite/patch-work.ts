import type { Database } from 'node-sqlite3-wasm';
import type { WorkItem, WorkPatch } from '@/types/work/records.js';
import { run } from './sql.js';
import { isoNow, queueRank } from './rank.js';
import { getWorkRow } from './read-work.js';

export function patchWork(db: Database, id: string, patch: WorkPatch): WorkItem | null {
  const current = getWorkRow(db, id);
  if (!current) return null;
  const title = patch.title ?? current.title;
  const content = patch.content ?? current.content;
  const priority = patch.priority ?? current.priority;
  const held = patch.held ?? current.status === 'held';
  const status = patch.status ?? (held ? 'held' : current.status === 'held' ? 'draft' : current.status);
  run(
    db,
    `UPDATE work SET title = ?, content = ?, status = ?, priority = ?, queue_rank = ?, updated_at = ?
     WHERE id = ?`,
    [title, content, status, priority, queueRank(priority, status === 'held'), isoNow(), id],
  );
  return getWorkRow(db, id);
}
