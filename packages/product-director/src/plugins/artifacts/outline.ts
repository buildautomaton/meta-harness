import { artifactPlugin } from './define.js';
import { file } from '@plugins/work/artifacts/file.js';
import { outlineHtml, outlineMarkdown } from '@plugins/work/artifacts/outline-pages.js';
import { OUTLINE_ARTIFACT_SCHEMA } from '@plugins/work-tools/schema/outline.js';
import { parseOutline } from '@plugins/work-tools/parse-extra.js';
import type { OutlineArtifactInput } from '@/types/work/outline.js';

export const outlineArtifactPlugin = () =>
  artifactPlugin('artifact-outline', {
    key: 'outline',
    description:
      'outline: compact /show-me change outline — trees, diffs, call flow — focused on what changed.',
    instructions: 'For structure, include an outline of trees, diffs, and flows that show the change.',
    schema: OUTLINE_ARTIFACT_SCHEMA,
    parse: parseOutline,
    buildFiles: (payload, ctx) => {
      const outline = payload as OutlineArtifactInput;
      return [
        file('outline.md', outlineMarkdown(outline)),
        file('outline.html', outlineHtml(String(ctx.title), outline)),
      ];
    },
  });
