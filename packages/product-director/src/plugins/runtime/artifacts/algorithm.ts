import { artifactPlugin } from './define.js';
import { mdFile } from './md-file.js';
import { algorithmMarkdown } from '@plugins/runtime/work/artifacts/algorithm-pages.js';
import { ALGORITHM_ARTIFACT_SCHEMA } from '@plugins/runtime/work-tools/schema/algorithm.js';
import { parseNamed } from '@plugins/runtime/work-tools/parse-parts.js';

export const algorithmArtifactPlugin = () =>
  artifactPlugin('artifact-algorithm', {
    key: 'algorithm',
    description:
      'algorithm: name, what changed vs before, and post-change pseudocode using this product’s real steps and domain terms.',
    instructions:
      'Include algorithm whenever behavior or logic steps changed. Use this product’s real names — summary alone is not enough.',
    schema: ALGORITHM_ARTIFACT_SCHEMA,
    parse: parseNamed,
    buildFiles: (payload) => {
      const algorithm = payload as Parameters<typeof algorithmMarkdown>[0];
      return mdFile('algorithm', algorithmMarkdown(algorithm));
    },
  });
