import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
import type { SessionBackendWrap } from '@runtime/session/types.js';
import type { SessionHooks } from './hooks.js';
import type { SessionImplementation } from './implementation.js';
import type { DiskSessionOptions, StreamSessionOptions } from './options.js';
import type { PluginSupport } from '@/types/capability.js';
import type { StoreContext, HttpContributeContext } from '@/types/http/contribution.js';
import type { HttpRegistry } from '@/types/http/registry.js';
import type { SqlMigration } from '@/types/sql-store/migration.js';

export type { SessionBackendWrap };

export type SessionPlugin = {
  name: string;
  kind: 'session';
  options: DiskSessionOptions | StreamSessionOptions;
  hooks?: SessionHooks;
  implementation?: SessionImplementation;
  wrapBackend?: SessionBackendWrap;
  supports?: PluginSupport;
  sqlMigrations?: readonly SqlMigration[];
  createFromStores?: (stores: StoreContext) => SessionImplementation;
  contributeHttp?: (
    http: HttpRegistry,
    ctx: HttpContributeContext,
  ) => void;
  runtime?: PluginRuntimeContext;
};

export type SessionPluginFactory = PluginFactory<
  DiskSessionOptions | StreamSessionOptions,
  SessionHooks,
  Partial<SessionImplementation>,
  SessionPlugin
>;

export type SessionPluginInit = PluginInit<
  DiskSessionOptions | StreamSessionOptions,
  SessionHooks,
  Partial<SessionImplementation>
>;
