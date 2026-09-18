import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
import type { SqlStore } from './implementation.js';
import type { SqlStoreOptions } from './options.js';

export type SqlStorePlugin = {
  name: string;
  kind: 'sql-store';
  options?: SqlStoreOptions;
  implementation: SqlStore;
  runtime?: PluginRuntimeContext;
};

export type SqlStorePluginFactory = PluginFactory<
  SqlStoreOptions,
  object,
  Partial<SqlStore>,
  SqlStorePlugin
>;

export type SqlStorePluginInit = PluginInit<SqlStoreOptions, object, Partial<SqlStore>>;
