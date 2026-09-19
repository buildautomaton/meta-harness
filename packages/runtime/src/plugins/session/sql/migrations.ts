import type { SqlMigration } from '@/types/sql-store/migration.js';
import { SESSION_SQL_SCHEMA } from './schema.js';

export const SESSION_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_session_checkpoint_v1',
    checkpoint: true,
    migrate: (sql) => {
      sql.exec(SESSION_SQL_SCHEMA);
    },
  },
];
