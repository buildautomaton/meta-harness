import { join } from 'node:path';
import type { SqlStorePlugin, SqlStorePluginInit } from '@/types/sql-store/plugin.js';
import { openSqliteDatabase } from './open.js';
import { createSqlStore } from './store.js';

export function defaultSqlFile(cwd: string): string {
  return join(cwd, '.harness', 'work.sqlite');
}

export function sqlStorePlugin(init: SqlStorePluginInit = {}): SqlStorePlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  const file = init.options?.file ?? defaultSqlFile(cwd);
  return {
    name: 'store-sql',
    kind: 'sql-store',
    options: { file, id: init.options?.id ?? 'sql' },
    implementation: { ...createSqlStore(openSqliteDatabase(file)), ...init.implementation },
    runtime: init.runtime,
  };
}
