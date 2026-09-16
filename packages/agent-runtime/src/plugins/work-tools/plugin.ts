import type { ToolsPlugin, ToolsPluginInit } from '@/types/tools/plugin.js';
import type { ToolsImplementation } from '@/types/tools/implementation.js';
import { WORK_TOOL_DEFINITIONS } from './definitions.js';
import { ASK_WHAT_TO_WORK_ON_TOOL, TELL_WHAT_WAS_BUILT_TOOL } from './names.js';
import { handleAskWhatToWorkOn } from './ask-handle.js';
import { handleTellWhatWasBuilt } from './tell-handle.js';
import { WORK_INSTRUCTIONS } from './instructions.js';

export function workToolsPlugin(init: ToolsPluginInit = {}): ToolsPlugin {
  const defaults: ToolsImplementation = {
    listTools: () => WORK_TOOL_DEFINITIONS,
    callTool: async (name, args, ctx) => {
      if (name === ASK_WHAT_TO_WORK_ON_TOOL) return handleAskWhatToWorkOn(ctx);
      if (name === TELL_WHAT_WAS_BUILT_TOOL) return handleTellWhatWasBuilt(args, ctx);
      return { content: [{ type: 'text', text: `Unknown work tool: ${name}` }], isError: true };
    },
    instructions: () => WORK_INSTRUCTIONS,
  };
  return {
    name: 'work-tools',
    kind: 'tools',
    options: init.options,
    hooks: init.hooks,
    implementation: { ...defaults, ...init.implementation },
    runtime: init.runtime,
  };
}
