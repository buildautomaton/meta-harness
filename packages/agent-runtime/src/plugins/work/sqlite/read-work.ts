import type { Database } from 'node-sqlite3-wasm';
import type { WorkItem } from '@/types/work/records.js';
import { all, one } from './sql.js';
import { mapWorkRow, sessionIdsFor } from './map-work.js';

export function listWorkRows(db: Database, status?: WorkItem['status']): WorkItem[] {
  const rows = status
    ? all(db, 'SELECT * FROM work WHERE status = ? ORDER BY queue_rank DESC, created_at ASC', [status])
    : all(db, 'SELECT * FROM work ORDER BY queue_rank DESC, created_at ASC');
  return rows.map((row) => mapWorkRow(row, sessionIdsFor(db, String(row.id))));
}

export function getWorkRow(db: Database, id: string): WorkItem | null {
  const row = one(db, 'SELECT * FROM work WHERE id = ?', [id]);
  return row ? mapWorkRow(row, sessionIdsFor(db, id)) : null;
}
