import type { WorkPlugin, WorkPluginInit } from '@/types/work/plugin.js';
import type { ArtifactKind, ArtifactPlugin } from '@/types/artifact/index.js';
import type { StoreContext } from '@buildautomaton/runtime';
import { createSqliteWorkBackend } from './backend.js';
import { contributeWorkHttp } from '@plugins/runtime/work/http/contribute.js';
import { WORK_MIGRATIONS } from './migrations.js';

export function sqliteWorkPlugin(init: WorkPluginInit = {}): WorkPlugin {
  return {
    name: 'work-sqlite',
    kind: 'work',
    options: { id: init.options?.id ?? 'sqlite', file: init.options?.file },
    hooks: init.hooks,
    supports: { stores: ['sql-store'], transports: ['http'] },
    sqlMigrations: WORK_MIGRATIONS,
    createFromStores: (stores) => {
      if (!stores.sqlStore) throw new Error('work plugin requires a sql-store plugin');
      const kinds = artifactKindsFrom(stores);
      stores.extras.artifacts = kinds;
      return {
        id: init.options?.id ?? 'sqlite',
        ...createSqliteWorkBackend(stores.sqlStore, kinds),
        ...init.implementation,
      };
    },
    contributeHttp: contributeWorkHttp,
    runtime: init.runtime,
  };
}

export function memoryWorkPlugin(init: WorkPluginInit = {}): WorkPlugin {
  return { ...sqliteWorkPlugin({ ...init, options: { ...init.options, id: init.options?.id ?? 'memory' } }), name: 'work-memory' };
}

function artifactKindsFrom(stores: StoreContext): ArtifactKind[] {
  return (stores.byKind.get('artifact') ?? [])
    .map((plugin) => (plugin as ArtifactPlugin).artifact)
    .filter((artifact): artifact is ArtifactKind => Boolean(artifact));
}
