import { artifactPlugin } from './define.js';
import { mdFile } from './md-file.js';
import { summaryMarkdown } from '@plugins/runtime/work/artifacts/summary-pages.js';
import { SUMMARY_ARTIFACT_SCHEMA } from '@plugins/runtime/work-tools/schema/summary.js';
import { parseSummary } from '@plugins/runtime/work-tools/parse-summary.js';
import type { SummaryArtifactInput } from '@/types/work/summary.js';

export const summaryArtifactPlugin = () =>
  artifactPlugin('artifact-summary', {
    key: 'summary',
    description: 'summary: plain-language area blurbs (2–3 sentences each) on what changed by surface.',
    instructions:
      'Include summary for every code change: one short area blurb per touched surface (backend, frontend, modules, …). Still pass ui/api/dataModel/algorithm when those surfaces changed.',
    schema: SUMMARY_ARTIFACT_SCHEMA,
    parse: parseSummary,
    buildFiles: (payload) => mdFile('summary', summaryMarkdown(payload as SummaryArtifactInput)),
  });
