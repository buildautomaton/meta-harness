import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import sqliteWasm from 'node-sqlite3-wasm';
import type { Database } from 'node-sqlite3-wasm';
import { WORK_SCHEMA } from './schema.js';
import { migrateWork } from './migrate.js';

const SqliteDatabase = (
  sqliteWasm as unknown as { Database: new (filename?: string) => Database }
).Database;

export type OpenedDb = { db: Database };

export function openSqlite(file?: string): OpenedDb {
  const path = file ?? ':memory:';
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new SqliteDatabase(path);
  db.exec(WORK_SCHEMA);
  migrateWork(db);
  return { db };
}
