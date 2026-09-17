import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { TELL_WHAT_WAS_BUILT_TOOL } from './names.js';
import { TELL_WHAT_WAS_BUILT_DESCRIPTION } from './descriptions.js';
import { QUESTIONS_SCHEMA } from './questions-schema.js';
import { UI_ARTIFACT_SCHEMA } from './schema/ui.js';
import { API_ARTIFACT_SCHEMA } from './schema/api.js';
import { ALGORITHM_ARTIFACT_SCHEMA, BACKEND_ARTIFACT_SCHEMA } from './schema/algorithm.js';
import { DATA_MODEL_ARTIFACT_SCHEMA, MODULE_STRUCTURE_ARTIFACT_SCHEMA } from './schema/diagrams.js';
import { OUTLINE_ARTIFACT_SCHEMA } from './schema/outline.js';
import { ASSETS_SCHEMA } from './schema/assets.js';

export const TELL_WHAT_WAS_BUILT_DEFINITION: McpToolDefinition = {
  name: TELL_WHAT_WAS_BUILT_TOOL,
  title: 'Submit completed work',
  description: TELL_WHAT_WAS_BUILT_DESCRIPTION,
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description'],
    properties: {
      title: { type: 'string', description: 'Short title of what was built' },
      description: {
        type: 'string',
        description: 'Description of the changes: what was built, why, and how it differs from before',
      },
      sessionId: { type: 'string', description: 'Session ID from ask_what_to_work_on. Always pass it.' },
      turnId: { type: 'string', description: 'Turn this work belongs to, if known' },
      ui: UI_ARTIFACT_SCHEMA,
      api: API_ARTIFACT_SCHEMA,
      algorithm: ALGORITHM_ARTIFACT_SCHEMA,
      dataModel: DATA_MODEL_ARTIFACT_SCHEMA,
      moduleStructure: MODULE_STRUCTURE_ARTIFACT_SCHEMA,
      backend: BACKEND_ARTIFACT_SCHEMA,
      outline: OUTLINE_ARTIFACT_SCHEMA,
      assets: ASSETS_SCHEMA,
      questions: QUESTIONS_SCHEMA,
    },
  },
};
