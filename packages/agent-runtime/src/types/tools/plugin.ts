import type { PluginFactory, PluginInit, PluginRuntimeContext } from '../plugin.js';
import type { ToolsHooks } from './hooks.js';
import type { ToolsImplementation } from './implementation.js';
import type { SubagentToolsOptions } from './options.js';

export type ToolsPlugin = {
  name: string;
  kind: 'tools';
  options?: SubagentToolsOptions;
  hooks?: ToolsHooks;
  implementation: ToolsImplementation;
  runtime?: PluginRuntimeContext;
};

export type ToolsPluginFactory = PluginFactory<
  SubagentToolsOptions,
  ToolsHooks,
  Partial<ToolsImplementation>,
  ToolsPlugin
>;

export type ToolsPluginInit = PluginInit<SubagentToolsOptions, ToolsHooks, Partial<ToolsImplementation>>;
