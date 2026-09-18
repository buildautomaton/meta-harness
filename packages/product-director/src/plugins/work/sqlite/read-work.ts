import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { WorkItem } from '@/types/work/records.js';
import { all, one } from './sql.js';
import { mapWorkRow, sessionIdsFor } from './map-work.js';

export function listWorkRows(db: SqlStore, status?: WorkItem['status']): WorkItem[] {
  const rows = status
    ? all(db, 'SELECT * FROM work WHERE status = ? ORDER BY queue_rank DESC, created_at ASC', [status])
    : all(db, 'SELECT * FROM work ORDER BY queue_rank DESC, created_at ASC');
  return rows.map((row) => mapWorkRow(row, sessionIdsFor(db, String(row.id)), db));
}

export function getWorkRow(db: SqlStore, id: string): WorkItem | null {
  const row = one(db, 'SELECT * FROM work WHERE id = ?', [id]);
  return row ? mapWorkRow(row, sessionIdsFor(db, id), db) : null;
}

export function nextQueued(db: SqlStore): WorkItem | null {
  return listWorkRows(db, 'queued').find((item) => !item.paused) ?? null;
}
