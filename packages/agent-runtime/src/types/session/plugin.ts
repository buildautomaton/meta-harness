import type { PluginFactory, PluginInit, PluginRuntimeContext } from '../plugin.js';
import type { SessionHooks } from './hooks.js';
import type { SessionImplementation } from './implementation.js';
import type { DiskSessionOptions, StreamSessionOptions } from './options.js';

export type SessionPlugin = {
  name: string;
  kind: 'session';
  options: DiskSessionOptions | StreamSessionOptions;
  hooks?: SessionHooks;
  implementation?: SessionImplementation;
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
