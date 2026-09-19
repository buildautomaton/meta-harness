import type { McpToolDefinition } from '@buildautomaton/runtime';
import { ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT } from './names.js';
import { ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DESCRIPTION } from './descriptions.js';

export const ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DEFINITION: McpToolDefinition = {
  name: ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT,
  title: 'Ask the product director what to build next',
  description: ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DESCRIPTION,
  inputSchema: { type: 'object', additionalProperties: false, properties: {} },
};
