import type { McpToolDefinition } from '@buildautomaton/runtime';
import type { ArtifactKind } from '@/types/artifact/kind.js';
import { TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT } from './names.js';
import { TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT_DESCRIPTION } from './descriptions.js';
import { QUESTIONS_SCHEMA } from './questions-schema.js';
import { ASSETS_SCHEMA } from './schema/assets.js';
import { builtinArtifactKinds } from '../artifacts/builtins.js';

export function tellWhatWasBuiltDefinition(artifacts: ArtifactKind[]): McpToolDefinition {
  const properties: Record<string, unknown> = {
    title: { type: 'string', description: 'Short title of what was built' },
    description: {
      type: 'string',
      description: 'Description of the changes: what was built, why, and how it differs from before',
    },
    sessionId: {
      type: 'string',
      description: 'Session ID from ask_product_director_what_to_build_next. Always pass it.',
    },
    turnId: { type: 'string', description: 'Turn this work belongs to, if known' },
    assets: ASSETS_SCHEMA,
    questions: QUESTIONS_SCHEMA,
  };
  for (const kind of artifacts) properties[kind.key] = kind.schema;
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
      required: ['title', 'description'],
      properties,
    },
  };
}

export const TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT_DEFINITION =
  tellWhatWasBuiltDefinition(builtinArtifactKinds());
