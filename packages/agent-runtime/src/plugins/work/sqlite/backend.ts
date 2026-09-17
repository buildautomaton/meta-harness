import type { WorkImplementation } from '@/types/work/implementation.js';
import type { OpenedDb } from './open-db.js';
import { openSqlite } from './open-db.js';
import { createWorkHub } from './hub.js';
import { sqliteMethods } from './methods.js';

export function createSqliteWorkBackend(file?: string): WorkImplementation {
  let opened: OpenedDb | undefined;
  const hub = createWorkHub();
  const dbp = () => (opened ??= openSqlite(file));
  const withDb = async <T>(fn: (db: OpenedDb['db']) => T | Promise<T>): Promise<T> => fn(dbp().db);
  return sqliteMethods(withDb, hub);
}
