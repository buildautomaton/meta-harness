import type { LogFn } from './log.js';

export type PluginKind = 'harness' | 'session' | 'transport' | 'tools';

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

export type AgentRuntimePlugin = {
  name: string;
  kind: PluginKind;
  options?: object;
  hooks?: object;
  implementation?: object;
  runtime?: PluginRuntimeContext;
};

export type PluginFactory<Options, Hooks, Implementation, Result extends AgentRuntimePlugin = AgentRuntimePlugin> = (
  init?: PluginInit<Options, Hooks, Implementation>,
) => Result;
