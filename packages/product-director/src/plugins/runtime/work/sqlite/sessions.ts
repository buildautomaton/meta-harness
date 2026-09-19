import type { SqlStore } from '@buildautomaton/runtime';
import type { WorkSessionLink } from '@/types/work/records.js';
import { all, run } from './sql.js';
import { isoNow } from './rank.js';

export function insertSession(
  db: SqlStore,
  row: { sessionId: string; workId: string; status: 'picked_up' | 'completed'; createdAt: string },
): WorkSessionLink {
  run(
    db,
    `INSERT OR REPLACE INTO work_session
     (session_id, work_id, status, created_at, completed_at, artifact_id)
     VALUES (?, ?, ?, ?, NULL, NULL)`,
    [row.sessionId, row.workId, row.status, row.createdAt],
  );
  return {
    sessionId: row.sessionId,
    workId: row.workId,
    status: row.status,
    createdAt: row.createdAt,
    completedAt: null,
    artifactId: null,
  };
}

export function completeSessionRow(db: SqlStore, sessionId: string, artifactId: string): void {
  const now = isoNow();
  run(
    db,
    `UPDATE work_session SET status = 'completed', completed_at = ?, artifact_id = ?
     WHERE session_id = ?`,
    [now, artifactId, sessionId],
  );
  run(
    db,
    `UPDATE work SET status = 'completed', completed_at = ?, updated_at = ?
     WHERE id IN (SELECT work_id FROM work_session WHERE session_id = ?)`,
    [now, now, sessionId],
  );
}

export function listSessionRows(db: SqlStore, workId: string): WorkSessionLink[] {
  return all(db, 'SELECT * FROM work_session WHERE work_id = ?', [workId]).map((row) => ({
    sessionId: String(row.session_id),
    workId: String(row.work_id),
    status: row.status === 'completed' ? 'completed' : 'picked_up',
    createdAt: String(row.created_at),
    completedAt: row.completed_at == null ? null : String(row.completed_at),
    artifactId: row.artifact_id == null ? null : String(row.artifact_id),
  }));
}
