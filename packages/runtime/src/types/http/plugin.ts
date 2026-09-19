import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
import type { TransportHooks } from '@/types/transport/hooks.js';
import type { TransportImplementation } from '@/types/transport/implementation.js';
import type { HttpTransportOptions } from '@/types/transport/options.js';
import type { HttpRegistry } from './registry.js';

export type HttpPlugin = {
  name: string;
  kind: 'http';
  options: HttpTransportOptions;
  hooks?: TransportHooks;
  implementation: TransportImplementation;
  registry: HttpRegistry;
  runtime?: PluginRuntimeContext;
};

export type HttpPluginFactory = PluginFactory<
  HttpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation>,
  HttpPlugin
>;

export type HttpPluginInit = PluginInit<
  HttpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation>
>;
