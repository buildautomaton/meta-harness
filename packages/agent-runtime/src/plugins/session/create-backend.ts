import { join } from 'node:path';
import type { SessionBackend } from '../../runtime/session/types.js';
import type { SessionBackendKind } from '../../types/session/options.js';
import { createDiskBackend } from './disk-backend.js';
import { createStreamBackend } from './stream-backend.js';

export function defaultSessionsDir(cwd: string): string {
  return join(cwd, '.harness', 'sessions');
}

export function createSessionBackend(options: {
  kind?: SessionBackendKind;
  dir?: string;
  cwd: string;
}): SessionBackend {
  const dir = options.dir ?? defaultSessionsDir(options.cwd);
  const disk = createDiskBackend(dir);
  if (options.kind === 'stream') return createStreamBackend();
  return disk;
}

export function wrapBackend(
  base: SessionBackend,
  plugin: SessionBackend | ((base: SessionBackend) => SessionBackend) | undefined,
): SessionBackend {
  if (!plugin) return base;
  return typeof plugin === 'function' ? plugin(base) : plugin;
}
