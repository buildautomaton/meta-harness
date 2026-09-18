import { artifactPlugin } from './define.js';
import { pair } from './pair.js';
import { backendHtml } from '@plugins/work/artifacts/text-pages.js';
import { BACKEND_ARTIFACT_SCHEMA } from '@plugins/work-tools/schema/algorithm.js';
import { parseBackend } from '@plugins/work-tools/parse-parts.js';

export const backendArtifactPlugin = () =>
  artifactPlugin('artifact-backend', {
    key: 'backend',
    description: 'backend: plain English for other backend work not covered by the other kinds.',
    instructions: 'Use backend for work that is not UI, API, algorithm, data model, modules, or outline.',
    schema: BACKEND_ARTIFACT_SCHEMA,
    parse: parseBackend,
    buildFiles: (payload, ctx) => {
      const backend = payload as { description: string };
      return pair('backend', `${backend.description}\n`, backendHtml(String(ctx.title), backend.description));
    },
  });
