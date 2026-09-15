import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
import type { SessionBackendWrap } from '@runtime/session/types.js';
import type { SessionHooks } from './hooks.js';
import type { SessionImplementation } from './implementation.js';
import type { DiskSessionOptions, StreamSessionOptions } from './options.js';

export type { SessionBackendWrap };

export type SessionPlugin = {
  name: string;
  kind: 'session';
  options: DiskSessionOptions | StreamSessionOptions;
  hooks?: SessionHooks;
  implementation?: SessionImplementation;
  /** Stack on the current backend (stream wrap). Omit when setting `implementation`. */
  wrapBackend?: SessionBackendWrap;
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
