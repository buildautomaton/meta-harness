import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
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
  runtime?: PluginRuntimeContext;
};

export type WorkPluginFactory = PluginFactory<
  WorkOptions,
  WorkHooks,
  Partial<WorkImplementation>,
  WorkPlugin
>;

export type WorkPluginInit = PluginInit<WorkOptions, WorkHooks, Partial<WorkImplementation>>;
