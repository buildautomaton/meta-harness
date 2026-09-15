import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { SPAWN_MINION_TOOL } from './names.js';

export const SPAWN_MINION_DEFINITION: McpToolDefinition = {
  name: SPAWN_MINION_TOOL,
  title: 'Run minion (use instead of Task)',
  description:
    'Drop-in replacement for builtin Task/subagent/explore: spawn a coding minion in this workspace and WAIT until it finishes or needs the user, streaming progress into this tool call. Returns the minion message transcript (no tool-call dumps). Do not use Task. Permission requests arrive as MCP notifications while this call is in flight — resolve_minion_request on a separate call, then await_minion. For several minions, call spawn_minion multiple times in one turn.',
  inputSchema: {
    type: 'object',
    properties: {
      harness: {
        type: 'string',
        description: 'Harness type (e.g. cursor-cli, claude-code, codex-acp). Call get_minion_context to list them.',
      },
      model: { type: 'string', description: 'Optional model id for the harness.' },
      prompt: { type: 'string', description: 'Self-contained prompt for the minion.' },
    },
    required: ['harness', 'prompt'],
  },
};
