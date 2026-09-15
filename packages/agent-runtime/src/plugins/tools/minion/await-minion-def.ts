import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { AWAIT_MINION_TOOL } from './names.js';

export const AWAIT_MINION_DEFINITION: McpToolDefinition = {
  name: AWAIT_MINION_TOOL,
  title: 'Wait for minion (realtime)',
  description:
    'Block until a minion finishes or needs the user, streaming progress as MCP notifications on this tool call. Use after resolve_minion_request (spawn_minion already waits). Do not poll get_minion in a loop — await instead. Returns compacted agent messages only.',
  inputSchema: {
    type: 'object',
    properties: {
      minionId: { type: 'string', description: 'Minion ID returned by spawn_minion.' },
    },
    required: ['minionId'],
  },
};
