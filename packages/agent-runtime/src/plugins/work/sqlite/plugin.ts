import { join } from 'node:path';
import type { WorkPlugin } from '@/types/work/plugin.js';
import type { WorkPluginInit } from '@/types/work/plugin.js';
import { createSqliteWorkBackend } from './backend.js';

export function defaultWorkFile(cwd: string): string {
  return join(cwd, '.harness', 'work.sqlite');
}

export function sqliteWorkPlugin(init: WorkPluginInit = {}): WorkPlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  const file = init.options?.file ?? defaultWorkFile(cwd);
  const methods = createSqliteWorkBackend(file);
  return {
    name: 'work-sqlite',
    kind: 'work',
    options: { file, id: init.options?.id ?? 'sqlite' },
    hooks: init.hooks,
    implementation: { ...methods, ...init.implementation },
    runtime: init.runtime,
  };
}

export function memoryWorkPlugin(init: WorkPluginInit = {}): WorkPlugin {
  const methods = createSqliteWorkBackend(':memory:');
  return {
    name: 'work-memory',
    kind: 'work',
    options: { id: init.options?.id ?? 'memory' },
    hooks: init.hooks,
    implementation: { ...methods, ...init.implementation },
    runtime: init.runtime,
  };
}
