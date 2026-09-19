import type {
  PluginFactory,
  PluginInit,
  PluginRuntimeContext,
  PluginSupport,
  StoreContext,
  HttpContributeContext,
  HttpRegistry,
  SqlMigration,
} from '@buildautomaton/runtime';
import type { WorkBackendWrap, WorkImplementation } from './implementation.js';
import type { WorkHooks } from './hooks.js';
import type { WorkOptions } from './options.js';

export type WorkPlugin = {
  name: string;
  kind: 'work';
  options?: WorkOptions;
  hooks?: WorkHooks;
  implementation?: WorkImplementation;
  wrapBackend?: WorkBackendWrap;
  supports?: PluginSupport;
  sqlMigrations?: readonly SqlMigration[];
  createFromStores?: (stores: StoreContext) => WorkImplementation;
  contributeHttp?: (http: HttpRegistry, ctx: HttpContributeContext) => void;
  runtime?: PluginRuntimeContext;
};

export type WorkPluginFactory = PluginFactory<
  WorkOptions,
  WorkHooks,
  Partial<WorkImplementation>,
  WorkPlugin
>;

export type WorkPluginInit = PluginInit<WorkOptions, WorkHooks, Partial<WorkImplementation>>;
