import type { LogFn } from './log.js';
import type { SqlMigration } from './sql-store/migration.js';
import type { StoreContext, HttpContributeContext } from './http/contribution.js';
import type { HttpRegistry } from './http/registry.js';

export type PluginKind = string;

export const KERNEL_PLUGIN_KINDS = [
  'harness',
  'session',
  'transport',
  'tools',
  'file-store',
  'sql-store',
  'http',
] as const;

export type KernelPluginKind = (typeof KERNEL_PLUGIN_KINDS)[number];

export type PluginRuntimeContext = {
  cwd: string;
  log: LogFn;
};

/** Named arguments for every plugin factory. */
export type PluginInit<Options = Record<string, never>, Hooks = object, Implementation = object> = {
  options?: Options;
  hooks?: Hooks;
  implementation?: Implementation;
  runtime?: PluginRuntimeContext;
};

export type RuntimePlugin = {
  name: string;
  kind: PluginKind;
  options?: object;
  hooks?: object;
  implementation?: object;
  runtime?: PluginRuntimeContext;
  sqlMigrations?: readonly SqlMigration[];
  createFromStores?: (stores: StoreContext) => unknown;
  contributeHttp?: (http: HttpRegistry, ctx: HttpContributeContext) => void;
};

export type PluginFactory<Options, Hooks, Implementation, Result extends RuntimePlugin = RuntimePlugin> = (
  init?: PluginInit<Options, Hooks, Implementation>,
) => Result;
