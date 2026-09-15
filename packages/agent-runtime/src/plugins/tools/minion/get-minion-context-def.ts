import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { GET_MINION_CONTEXT_TOOL } from './names.js';

export const GET_MINION_CONTEXT_DEFINITION: McpToolDefinition = {
  name: GET_MINION_CONTEXT_TOOL,
  title: 'Confirm minion workspace',
  description:
    'Call before spawn_minion to confirm minions share this coordinator working directory. spawn_minion waits like Task — you do not need builtin Task/subagent tools.',
  inputSchema: { type: 'object', properties: {} },
};
