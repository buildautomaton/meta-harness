import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import sqliteWasm from 'node-sqlite3-wasm';
import type { Database } from 'node-sqlite3-wasm';

const SqliteDatabase = (
  sqliteWasm as unknown as { Database: new (filename?: string) => Database }
).Database;

export function openSqliteDatabase(file?: string): Database {
  const path = file ?? ':memory:';
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  return new SqliteDatabase(path);
}
