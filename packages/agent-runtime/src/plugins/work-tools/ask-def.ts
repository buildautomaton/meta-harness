import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { ASK_WHAT_TO_WORK_ON_TOOL } from './names.js';
import { ASK_WHAT_TO_WORK_ON_DESCRIPTION } from './descriptions.js';

export const ASK_WHAT_TO_WORK_ON_DEFINITION: McpToolDefinition = {
  name: ASK_WHAT_TO_WORK_ON_TOOL,
  title: 'Ask what to work on next',
  description: ASK_WHAT_TO_WORK_ON_DESCRIPTION,
  inputSchema: { type: 'object', additionalProperties: false, properties: {} },
};
