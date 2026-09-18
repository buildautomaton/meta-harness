import { sqlStorePlugin, type SqlStore } from '@buildautomaton/agent-runtime';
import type { ArtifactKind } from '@/types/artifact/kind.js';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { createWorkHub } from './hub.js';
import { sqliteMethods } from './methods.js';
import { WORK_MIGRATIONS } from './migrations.js';
import { builtinArtifactKinds } from '../../artifacts/builtins.js';

export function memorySqlStore(): SqlStore {
  return sqlStorePlugin({ options: { file: ':memory:' } }).implementation;
}

export function createSqliteWorkBackend(
  sql: SqlStore = memorySqlStore(),
  artifacts: ArtifactKind[] = builtinArtifactKinds(),
): WorkImplementation {
  sql.migrate('work-sqlite', WORK_MIGRATIONS);
  const hub = createWorkHub();
  const withDb = async <T>(fn: (db: SqlStore) => T | Promise<T>): Promise<T> => fn(sql);
  return sqliteMethods(withDb, hub, artifacts);
}
