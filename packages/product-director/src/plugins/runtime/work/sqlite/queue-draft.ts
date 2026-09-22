import type { SqlStore } from '@buildautomaton/runtime';
import type { WorkItem } from '@/types/work/records.js';
import type { WorkHub } from './hub.js';
import { getWorkRow } from './read-work.js';
import { bottomRank } from './move-queue.js';
import { isoNow } from './rank.js';
import { run } from './sql.js';

/** Promote a draft onto the queue, ending any in-flight interview. */
export function queueDraft(db: SqlStore, hub: WorkHub, id: string): WorkItem | null {
  const item = getWorkRow(db, id);
  if (!item) return null;
  if (item.status !== 'draft') return item;
  hub.resolveAnswers(id, []);
  run(db, 'DELETE FROM work_question WHERE work_id = ?', [id]);
  run(db, "UPDATE work SET status = 'queued', queue_rank = ?, updated_at = ? WHERE id = ?", [
    bottomRank(db),
    isoNow(),
    id,
  ]);
  return getWorkRow(db, id);
}

export function promoteToQueue(db: SqlStore, workId: string): WorkItem | null {
  run(db, "UPDATE work SET status = 'queued', queue_rank = ?, updated_at = ? WHERE id = ?", [
    bottomRank(db),
    isoNow(),
    workId,
  ]);
  return getWorkRow(db, workId);
}
