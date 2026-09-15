import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { GET_MINION_TRANSCRIPT_TOOL } from './names.js';

export const GET_MINION_TRANSCRIPT_DEFINITION: McpToolDefinition = {
  name: GET_MINION_TRANSCRIPT_TOOL,
  title: 'Minion message transcript',
  description:
    'Return only the minion agent messages, compacted into one transcript. Omits tool-call output and reasoning traces. Use this instead of reading on-disk session files.',
  inputSchema: {
    type: 'object',
    properties: {
      minionId: { type: 'string', description: 'Minion ID returned by spawn_minion.' },
    },
    required: ['minionId'],
  },
};
