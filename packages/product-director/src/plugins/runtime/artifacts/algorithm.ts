import { artifactPlugin } from './define.js';
import { pair } from './pair.js';
import { algorithmHtml, algorithmMarkdown } from '@plugins/runtime/work/artifacts/algorithm-pages.js';
import { ALGORITHM_ARTIFACT_SCHEMA } from '@plugins/runtime/work-tools/schema/algorithm.js';
import { parseNamed } from '@plugins/runtime/work-tools/parse-parts.js';

export const algorithmArtifactPlugin = () =>
  artifactPlugin('artifact-algorithm', {
    key: 'algorithm',
    description:
      'algorithm: name, what changed vs before, and post-change pseudocode using this product’s real steps and domain terms.',
    instructions: 'Algorithms must use this product’s real names, not generic examples.',
    schema: ALGORITHM_ARTIFACT_SCHEMA,
    parse: parseNamed,
    buildFiles: (payload) => {
      const algorithm = payload as Parameters<typeof algorithmMarkdown>[0];
      return pair('algorithm', algorithmMarkdown(algorithm), algorithmHtml(algorithm));
    },
  });
