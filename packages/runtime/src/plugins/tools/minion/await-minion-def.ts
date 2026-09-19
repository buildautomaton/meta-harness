import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { AWAIT_MINION_TOOL } from './names.js';

export const AWAIT_MINION_DEFINITION: McpToolDefinition = {
  name: AWAIT_MINION_TOOL,
  title: 'Wait for minion (realtime)',
  description:
    'Block until a minion finishes, streaming progress and permission prompts as MCP notifications on this tool call. spawn_minion already waits; use this only if a previous spawn already returned. After resolve_minion_request, prefer letting the still-running spawn continue. Do not poll get_minion. Returns compacted agent messages only.',
  inputSchema: {
    type: 'object',
    properties: {
      minionId: { type: 'string', description: 'Minion ID returned by spawn_minion.' },
    },
    required: ['minionId'],
  },
};
