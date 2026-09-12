import type { PluginFactory, PluginInit, PluginRuntimeContext } from '../plugin.js';
import type { HarnessHooks } from './hooks.js';
import type { HarnessImplementation } from './implementation.js';
import type { HarnessOptions } from './options.js';

export type HarnessPlugin = {
  name: string;
  kind: 'harness';
  options: HarnessOptions;
  hooks?: HarnessHooks;
  implementation: HarnessImplementation;
  runtime?: PluginRuntimeContext;
};

export type HarnessPluginFactory = PluginFactory<
  HarnessOptions,
  HarnessHooks,
  Partial<HarnessImplementation>,
  HarnessPlugin
>;

export type HarnessPluginInit = PluginInit<
  HarnessOptions,
  HarnessHooks,
  Partial<HarnessImplementation>
>;
