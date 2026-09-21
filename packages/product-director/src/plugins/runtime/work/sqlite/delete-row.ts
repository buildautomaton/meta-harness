import type { SqlStore } from '@buildautomaton/runtime';
import { run } from './sql.js';

export function deleteWorkRow(db: SqlStore, id: string): void {
  run(db, 'DELETE FROM work_decision WHERE work_id = ?', [id]);
  run(db, 'DELETE FROM work_question WHERE work_id = ?', [id]);
  run(db, 'DELETE FROM work_session WHERE work_id = ?', [id]);
  run(db, 'DELETE FROM work_asset WHERE work_id = ?', [id]);
  run(db, 'DELETE FROM work WHERE id = ?', [id]);
}
