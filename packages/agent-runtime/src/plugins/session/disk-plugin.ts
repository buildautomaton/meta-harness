import type { SessionPlugin } from '../../types/session/plugin.js';
import type { SessionHooks } from '../../types/session/hooks.js';
import type { SessionImplementation } from '../../types/session/implementation.js';
import type { PluginInit } from '../../types/plugin.js';
import type { DiskSessionOptions } from '../../types/session/options.js';
import { createDiskBackend } from './disk-backend.js';

export function diskSessionPlugin(
  init: PluginInit<DiskSessionOptions, SessionHooks, Partial<SessionImplementation>> & {
    options: DiskSessionOptions;
  },
): SessionPlugin {
  const backend = createDiskBackend(init.options.dir);
  const { id, ...methods } = backend;
  return {
    name: 'session-disk',
    kind: 'session',
    options: { dir: init.options.dir, id: init.options.id ?? id },
    hooks: init.hooks,
    implementation: { ...methods, ...init.implementation },
    runtime: init.runtime,
  };
}
