import type { McpToolDefinition } from '../../../types/tools/definitions.js';
import { SPAWN_MINION_TOOL } from './names.js';

export const SPAWN_MINION_DEFINITION: McpToolDefinition = {
  name: SPAWN_MINION_TOOL,
  title: 'Run minion (use instead of Task)',
  description:
    'Drop-in replacement for builtin Task/subagent/explore: spawn a coding minion in this workspace and WAIT until it finishes, streaming progress into this tool call. Returns the minion message transcript (no tool-call dumps). Do not use Task. Set background=true only to return a minionId without waiting, then call await_minion.',
  inputSchema: {
    type: 'object',
    properties: {
      harness: {
        type: 'string',
        description: 'Harness type (e.g. cursor-cli, claude-code, codex-acp). Call get_minion_context to list them.',
      },
      model: { type: 'string', description: 'Optional model id for the harness.' },
      prompt: { type: 'string', description: 'Self-contained prompt for the minion.' },
      background: {
        type: 'boolean',
        description: 'If true, return immediately with minionId. Default false: wait for completion like Task.',
      },
    },
    required: ['harness', 'prompt'],
  },
};
