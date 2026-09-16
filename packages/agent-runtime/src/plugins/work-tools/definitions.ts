import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { ASK_WHAT_TO_WORK_ON_DEFINITION } from './ask-def.js';
import { TELL_WHAT_WAS_BUILT_DEFINITION } from './tell-def.js';

export const WORK_TOOL_DEFINITIONS: McpToolDefinition[] = [
  ASK_WHAT_TO_WORK_ON_DEFINITION,
  TELL_WHAT_WAS_BUILT_DEFINITION,
];
