import type { SqlStore } from '@buildautomaton/runtime';
import { run } from './sql.js';
import { isoNow } from './rank.js';

export function renameProject(db: SqlStore, from: string, to: string): void {
  if (from === to) return;
  run(db, 'UPDATE work SET project = ?, updated_at = ? WHERE project = ?', [to, isoNow(), from]);
  run(db, 'UPDATE artifact SET project = ? WHERE project = ?', [to, from]);
}
