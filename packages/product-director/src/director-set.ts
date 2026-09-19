import type { PluginInit, PluginRuntimeContext, RuntimePlugin } from '@buildautomaton/runtime';
import { HTTP_DEFAULT_WORK_ROOT, type TransportEndpoint } from '@buildautomaton/runtime';
import { sqliteWorkPlugin } from './plugins/runtime/work/sqlite/plugin.js';
import { workToolsPlugin } from './plugins/runtime/work-tools/plugin.js';
import { artifactPlugins } from './plugins/runtime/artifacts/builtins.js';

export type ProductDirectorOptions = {
  work?: boolean;
  workRoot?: string;
};

export function directorHttpEndpoints(root = HTTP_DEFAULT_WORK_ROOT): TransportEndpoint[] {
  return [
    { plugin: 'work-sqlite', path: root },
    { plugin: 'session-disk', path: root },
  ];
}

export function productDirectorSet(
  init: PluginInit<ProductDirectorOptions, object, object> = {},
): RuntimePlugin[] {
  if (init.options?.work === false) return [];
  const runtime: PluginRuntimeContext | undefined = init.runtime;
  return [
    ...artifactPlugins(),
    sqliteWorkPlugin({ runtime }),
    workToolsPlugin({ runtime }),
  ];
}
