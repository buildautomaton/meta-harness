import type { PluginInit } from '../../types/plugin.js';
import type { SessionHooks } from '../../types/session/hooks.js';
import type { SessionImplementation } from '../../types/session/implementation.js';
import type { SessionPlugin } from '../../types/session/plugin.js';
import type { StreamSessionOptions } from '../../types/session/options.js';
import type { SessionBackendWrap } from '../../runtime/session/types.js';
import { createStreamBackend } from './stream-backend.js';

export function streamSessionPlugin(
  init: PluginInit<StreamSessionOptions, SessionHooks, Partial<SessionImplementation>> = {},
): SessionPlugin {
  const wrapBackend: SessionBackendWrap = (base) => ({
    ...createStreamBackend(base),
    ...init.implementation,
  });
  const plugin = {
    name: 'session-stream',
    kind: 'session' as const,
    options: { layer: true as const, id: init.options?.id },
    hooks: init.hooks,
    runtime: init.runtime,
    wrapBackend,
  };
  return plugin;
}
