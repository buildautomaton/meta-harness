import type { SqlStore } from '@/types/sql-store/implementation.js';
import type { SqlMigration } from '@/types/sql-store/migration.js';

export const MIGRATIONS_BOOTSTRAP = `
CREATE TABLE IF NOT EXISTS __migrations (
  scope TEXT NOT NULL,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (scope, name)
)
`;

function checkpointSatisfied(
  applied: ReadonlySet<string>,
  replaces: readonly string[] | undefined,
): boolean {
  return Boolean(replaces?.length) && replaces!.every((name) => applied.has(name));
}

function record(sql: SqlStore, scope: string, migration: SqlMigration, applied: Set<string>): void {
  sql.run('INSERT INTO __migrations (scope, name) VALUES (?, ?)', [scope, migration.name]);
  applied.add(migration.name);
  if (migration.checkpoint !== true || !migration.replacesLegacyMigrations?.length) return;
  for (const legacy of migration.replacesLegacyMigrations) {
    if (legacy === migration.name) continue;
    sql.run('DELETE FROM __migrations WHERE scope = ? AND name = ?', [scope, legacy]);
    applied.delete(legacy);
  }
}

/** Run one plugin's migrations in order. Other plugins' chains are independent. */
export function runSqliteMigrations(
  sql: SqlStore,
  scope: string,
  migrations: readonly SqlMigration[],
): void {
  sql.exec(MIGRATIONS_BOOTSTRAP);
  const applied = new Set(
    sql.all('SELECT name FROM __migrations WHERE scope = ?', [scope]).map((row) => String(row.name)),
  );
  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;
    if (migration.checkpoint === true && checkpointSatisfied(applied, migration.replacesLegacyMigrations)) {
      record(sql, scope, migration, applied);
      continue;
    }
    if (migration.alreadyApplied?.(sql)) {
      record(sql, scope, migration, applied);
      continue;
    }
    migration.migrate(sql);
    record(sql, scope, migration, applied);
  }
}
