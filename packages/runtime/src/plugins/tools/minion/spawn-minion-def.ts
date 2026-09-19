import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { SPAWN_MINION_TOOL } from './names.js';

export const SPAWN_MINION_DEFINITION: McpToolDefinition = {
  name: SPAWN_MINION_TOOL,
  title: 'Run minion (use instead of Task)',
  description:
    'Drop-in replacement for Task/subagent/explore. Always waits on THIS tool call until the minion finishes. Streams a short tool-call progress summary about every 10s (not raw JSON). There is NO background parameter — never pass background, is_background, or run_in_background. Permission requests are sampled against your current permission mode when possible, then elicited if the user must be asked; missed prompts are redelivered. resolve_minion_request can run while this call is in flight. For several minions, call spawn_minion multiple times in one turn. Do not use Task.',
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
