import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { SPAWN_MINION_TOOL } from './names.js';

export const SPAWN_MINION_DEFINITION: McpToolDefinition = {
  name: SPAWN_MINION_TOOL,
  title: 'Run minion (use instead of Task)',
  description:
    'Drop-in replacement for Task/subagent/explore. Always waits on THIS tool call until the minion finishes, streaming progress (and permission prompts) over SSE. There is NO background parameter — never pass background, is_background, or run_in_background. Permission requests arrive as MCP notifications/elicitation while this call is still in flight. Apply your current permission mode: resolve_minion_request immediately if that mode would auto-run the action; seek the user if it would ask them. For several minions, call spawn_minion multiple times in one turn. Do not use Task.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
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
