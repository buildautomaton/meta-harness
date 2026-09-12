import type { PluginFactory, PluginInit, PluginRuntimeContext } from '../plugin.js';
import type { TransportHooks } from './hooks.js';
import type { TransportImplementation } from './implementation.js';
import type { McpTransportOptions, RemoteTransportImplementation } from './options.js';

export type TransportPlugin = {
  name: string;
  kind: 'transport';
  options: McpTransportOptions;
  hooks?: TransportHooks;
  implementation: TransportImplementation;
  runtime?: PluginRuntimeContext;
};

export type TransportPluginFactory = PluginFactory<
  McpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation> | RemoteTransportImplementation,
  TransportPlugin
>;

export type TransportPluginInit = PluginInit<
  McpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation>
>;
