import type { SqlMigration } from './migration.js';

export type { SqlMigration };

export type SqlBind = string | number | null;

/** Shared SQL database. Plugins inject scoped migrations via `migrate`. */
export type SqlStore = {
  exec(sql: string): void;
  run(sql: string, params?: SqlBind[]): void;
  get(sql: string, params?: SqlBind[]): Record<string, unknown> | undefined;
  all(sql: string, params?: SqlBind[]): Record<string, unknown>[];
  transaction<T>(fn: () => T): T;
  migrate(scope: string, migrations: readonly SqlMigration[]): void;
};
