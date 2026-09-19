import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { RESOLVE_MINION_REQUEST_TOOL } from './names.js';

export const RESOLVE_MINION_DEFINITION: McpToolDefinition = {
  name: RESOLVE_MINION_REQUEST_TOOL,
  title: 'Answer minion permission or auth',
  description:
    'Resolve a minion permission, question, or provider-login request. Call this WHILE spawn_minion is still in flight when you see a permission notification — do not wait for other minions to finish. Apply your current permission mode: resolve immediately if that mode would auto-run the action; seek the user if it would ask them. Pending items share one shape: title, message, and options with labels (e.g. Allow all) plus optionId. Pass optionId or the label, or a token for harness auth.',
  inputSchema: {
    type: 'object',
    properties: {
      minionId: { type: 'string', description: 'Minion ID that raised the request.' },
      requestId: { type: 'string', description: 'Pending request ID from get_minion or the notification.' },
      outcome: {
        type: 'string',
        description: 'Human-readable choice (Allow once, Allow all, Reject) or optionId from pendingRequests.',
      },
      optionId: { type: 'string', description: 'Permission optionId from pendingRequests when the user picked one.' },
      token: { type: 'string', description: 'Provider API key/token when the minion needs auth.' },
    },
    required: ['minionId'],
  },
};
