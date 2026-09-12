import type { ToolsPlugin, ToolsPluginInit } from '../../types/tools/plugin.js';
import type { ToolsImplementation } from '../../types/tools/implementation.js';
import { CORE_TOOL_DEFINITIONS } from './definitions.js';
import { createCoreToolRegistry } from './core-registry.js';
import { launchSession } from './launch-session.js';
import { getSessionStatus } from './session-status.js';

const defaults: ToolsImplementation = {
  listTools: () => CORE_TOOL_DEFINITIONS,
  callTool: async (name, args, ctx) =>
    createCoreToolRegistry({
      launchAgent: (params) =>
        launchSession({
          manager: ctx.manager,
          backend: ctx.backend,
          cwd: ctx.cwd,
          params,
          sessionHooks: ctx.sessionHooks,
          toolsHooks: ctx.toolsHooks,
        }),
      getSession: (sessionId) => getSessionStatus(ctx.backend, sessionId),
    }).callTool(name, args),
};

export function subagentToolsPlugin(init: ToolsPluginInit = {}): ToolsPlugin {
  return {
    name: 'tools-subagent',
    kind: 'tools',
    options: init.options,
    hooks: init.hooks,
    implementation: { ...defaults, ...init.implementation },
    runtime: init.runtime,
  };
}
