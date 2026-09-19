import type { SqlStore } from '@buildautomaton/runtime';
import { all, run } from './sql.js';

const WORK_COLUMNS: [string, string][] = [
  ['paused', 'INTEGER NOT NULL DEFAULT 0'],
  ['prompt', "TEXT NOT NULL DEFAULT ''"],
  ['agent_context', "TEXT NOT NULL DEFAULT ''"],
  ['source_key', 'TEXT'],
];

export function migrateWork(db: SqlStore): void {
  const existing = new Set(
    all(db, 'PRAGMA table_info(work)').map((row) => String(row.name ?? row.Name ?? '')),
  );
  for (const [name, ddl] of WORK_COLUMNS) {
    if (!existing.has(name)) run(db, `ALTER TABLE work ADD COLUMN ${name} ${ddl}`);
  }
  run(db, "UPDATE work SET status = 'draft' WHERE status = 'held'");
}
