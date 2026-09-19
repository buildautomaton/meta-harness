import type { Database } from 'node-sqlite3-wasm';
import type { SqlBind, SqlStore } from '@/types/sql-store/implementation.js';
import { runSqliteMigrations } from './migrate.js';

export function createSqlStore(db: Database): SqlStore {
  const store: SqlStore = {
    exec(sql) {
      db.exec(sql);
    },
    run(sql, params: SqlBind[] = []) {
      if (params.length) db.run(sql, params);
      else db.run(sql);
    },
    get(sql, params: SqlBind[] = []) {
      const row = (params.length ? db.get(sql, params) : db.get(sql)) as Record<string, unknown> | null;
      return row ?? undefined;
    },
    all(sql, params: SqlBind[] = []) {
      const rows = (params.length ? db.all(sql, params) : db.all(sql)) as Record<string, unknown>[] | undefined;
      return rows ?? [];
    },
    transaction(fn) {
      db.exec('BEGIN');
      try {
        const result = fn();
        db.exec('COMMIT');
        return result;
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }
    },
    migrate(scope, migrations) {
      runSqliteMigrations(store, scope, migrations);
    },
  };
  return store;
}
