import type { SessionPlugin } from '@/types/session/plugin.js';
import type { SessionHooks } from '@/types/session/hooks.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { PluginInit } from '@/types/plugin.js';
import type { DiskSessionOptions } from '@/types/session/options.js';
import type { StoreContext } from '@/types/http/contribution.js';
import { createDiskBackend } from './backend.js';
import { createSqlSessionBackend } from '@plugins/session/sql/backend.js';
import { composeSessionStores } from '@plugins/session/compose.js';
import { contributeSessionHttp } from '@plugins/session/http/contribute.js';
import { SESSION_MIGRATIONS } from '@plugins/session/sql/migrations.js';

export function diskSessionPlugin(
  init: PluginInit<DiskSessionOptions, SessionHooks, Partial<SessionImplementation>> & {
    options: DiskSessionOptions;
  },
): SessionPlugin {
  return {
    name: 'session-disk',
    kind: 'session',
    options: { dir: init.options.dir, id: init.options.id ?? 'disk' },
    hooks: init.hooks,
    supports: { stores: ['file-store', 'sql-store'], transports: ['http'] },
    createFromStores: (stores) => createSessionFromStores(init.options.dir, stores, init.implementation),
    contributeHttp: contributeSessionHttp,
    sqlMigrations: SESSION_MIGRATIONS,
    runtime: init.runtime,
  };
}

function createSessionFromStores(
  dir: string,
  stores: StoreContext,
  override?: Partial<SessionImplementation>,
): SessionImplementation {
  const disk = stores.fileStore ? createDiskBackend(dir, stores.fileStore) : undefined;
  const sql = stores.sqlStore ? createSqlSessionBackend(stores.sqlStore) : undefined;
  return { ...composeSessionStores(disk, sql), ...override };
}
