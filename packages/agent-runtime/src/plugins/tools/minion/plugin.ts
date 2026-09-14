import type { ToolsPlugin, ToolsPluginInit } from '../../../types/tools/plugin.js';
import type { ToolsImplementation } from '../../../types/tools/implementation.js';
import { CORE_TOOL_DEFINITIONS } from './definitions.js';
import { createCoreToolRegistry } from './core-registry.js';
import { bindMinionHost } from './bind-host.js';
import { createPendingStore } from './pending-store.js';
import { MINION_INSTRUCTIONS, MINION_PROMPT } from './instructions.js';

/** One tools plugin: spawn/await/get minions. Register beside any other `kind: 'tools'` plugin. */
export function minionToolsPlugin(init: ToolsPluginInit = {}): ToolsPlugin {
  const pending = createPendingStore();
  const defaults: ToolsImplementation = {
    listTools: () => CORE_TOOL_DEFINITIONS,
    callTool: async (name, args, ctx, extras) =>
      createCoreToolRegistry(bindMinionHost(ctx, pending, extras)).callTool(name, args),
    instructions: () => MINION_INSTRUCTIONS,
    prompts: () => [MINION_PROMPT],
  };
  return {
    name: 'tools-minion',
    kind: 'tools',
    options: init.options,
    hooks: init.hooks,
    implementation: { ...defaults, ...init.implementation },
    runtime: init.runtime,
  };
}
