import type { McpToolDefinition } from '../../../types/tools/definitions.js';
import { GET_MINION_TOOL } from './names.js';

export const GET_MINION_DEFINITION: McpToolDefinition = {
  name: GET_MINION_TOOL,
  title: 'Minion status and transcript',
  description:
    'Snapshot of a minion: status, pending permission/auth (same shape as notifications: title, message, labeled options), and compacted agent-message transcript. Prefer await_minion for live waiting. Do not read session files — use this or get_minion_transcript.',
  inputSchema: {
    type: 'object',
    properties: {
      minionId: { type: 'string', description: 'Minion ID returned by spawn_minion.' },
    },
    required: ['minionId'],
  },
};
