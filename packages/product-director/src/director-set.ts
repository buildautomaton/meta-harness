import type { PluginInit, PluginRuntimeContext, AgentRuntimePlugin } from '@buildautomaton/agent-runtime';
import { HTTP_DEFAULT_WORK_ROOT, type TransportEndpoint } from '@buildautomaton/agent-runtime';
import { sqliteWorkPlugin } from './plugins/work/sqlite/plugin.js';
import { workToolsPlugin } from './plugins/work-tools/plugin.js';
import { artifactPlugins } from './plugins/artifacts/builtins.js';

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
): AgentRuntimePlugin[] {
  if (init.options?.work === false) return [];
  const runtime: PluginRuntimeContext | undefined = init.runtime;
  return [
    ...artifactPlugins(),
    sqliteWorkPlugin({ runtime }),
    workToolsPlugin({ runtime }),
  ];
}
