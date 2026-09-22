import type { McpToolDefinition } from '@buildautomaton/runtime';
import type { ArtifactKind } from '@/types/artifact/kind.js';
import { TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT } from './names.js';
import { TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT_DESCRIPTION } from './descriptions.js';
import { QUESTIONS_SCHEMA } from './questions-schema.js';
import { ASSETS_SCHEMA } from './schema/assets.js';
import { SESSION_ID_PROPERTY, TELL_OUTPUT_SCHEMA } from './session-schemas.js';
import { builtinArtifactKinds } from '../artifacts/builtins.js';

export function tellWhatWasBuiltDefinition(artifacts: ArtifactKind[]): McpToolDefinition {
  const properties: Record<string, unknown> = {
    title: { type: 'string', description: 'Short title of what was built' },
    description: {
      type: 'string',
      description:
        'At most 2–3 plain-language sentences on what was built and why. No jargon dumps or file lists.',
    },
    project: {
      type: 'string',
      description: 'Project this work belongs to. Shown as a tab on the dashboard.',
    },
    sessionId: SESSION_ID_PROPERTY,
    turnId: { type: 'string', description: 'Turn this work belongs to, if known' },
  };
  // Artifact kinds before questions so agents see ui/api/dataModel/algorithm ahead of the large questionnaire.
  for (const kind of artifacts) properties[kind.key] = kind.schema;
  properties.assets = ASSETS_SCHEMA;
  properties.questions = QUESTIONS_SCHEMA;
  const extra = artifacts.map((kind) => kind.description).filter(Boolean).join('\n');
  return {
    name: TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT,
    title: 'Tell the product director what was built',
    description: [TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT_DESCRIPTION, extra && `Details\n${extra}`]
      .filter(Boolean)
      .join('\n\n'),
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'description', 'project'],
      properties,
    },
    outputSchema: TELL_OUTPUT_SCHEMA,
  };
}

export const TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT_DEFINITION =
  tellWhatWasBuiltDefinition(builtinArtifactKinds());
