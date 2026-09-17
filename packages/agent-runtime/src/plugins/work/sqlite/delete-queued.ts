import type { Database } from 'node-sqlite3-wasm';
import { run } from './sql.js';
import { findBySource, sourceStatus } from './source-key.js';

export function deleteQueuedBySource(db: Database, sourceKey: string): string | undefined {
  const id = findBySource(db, sourceKey);
  if (!id || sourceStatus(db, sourceKey) !== 'queued') return undefined;
  run(db, 'DELETE FROM work_decision WHERE work_id = ?', [id]);
  run(db, 'DELETE FROM work_question WHERE work_id = ?', [id]);
  run(db, 'DELETE FROM work_session WHERE work_id = ?', [id]);
  run(db, 'DELETE FROM work WHERE id = ?', [id]);
  return id;
}
