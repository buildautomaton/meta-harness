import type { McpToolDefinition } from '../../../types/tools/definitions.js';
import { GET_MINION_CONTEXT_DEFINITION } from './get-minion-context-def.js';
import { GET_MINION_TRANSCRIPT_DEFINITION } from './get-minion-transcript-def.js';
import { GET_MINION_DEFINITION } from './get-minion-def.js';
import { AWAIT_MINION_DEFINITION } from './await-minion-def.js';
import { RESOLVE_MINION_DEFINITION } from './resolve-minion-def.js';
import { SPAWN_MINION_DEFINITION } from './spawn-minion-def.js';

export const CORE_TOOL_DEFINITIONS: McpToolDefinition[] = [
  SPAWN_MINION_DEFINITION,
  AWAIT_MINION_DEFINITION,
  GET_MINION_CONTEXT_DEFINITION,
  GET_MINION_DEFINITION,
  GET_MINION_TRANSCRIPT_DEFINITION,
  RESOLVE_MINION_DEFINITION,
];
