import type { SqlStore } from '@buildautomaton/runtime';
import { all, run } from './sql.js';

export function migrateProject(db: SqlStore): void {
  addColumn(db, 'work', 'project', "TEXT NOT NULL DEFAULT ''");
  addColumn(db, 'artifact', 'project', "TEXT NOT NULL DEFAULT ''");
}

export function projectColumnsPresent(db: SqlStore): boolean {
  return hasColumn(db, 'work', 'project') && hasColumn(db, 'artifact', 'project');
}

function hasColumn(db: SqlStore, table: string, name: string): boolean {
  return all(db, `PRAGMA table_info(${table})`).some((row) => String(row.name ?? '') === name);
}

function addColumn(db: SqlStore, table: string, name: string, ddl: string): void {
  if (!hasColumn(db, table, name)) run(db, `ALTER TABLE ${table} ADD COLUMN ${name} ${ddl}`);
}
