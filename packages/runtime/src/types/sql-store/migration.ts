import type { SqlStore } from './implementation.js';

/** One named schema change, scoped to the plugin that injected it. */
export type SqlMigration = {
  name: string;
  migrate: (sql: SqlStore) => void;
  alreadyApplied?: (sql: SqlStore) => boolean;
  checkpoint?: boolean;
  replacesLegacyMigrations?: readonly string[];
};
