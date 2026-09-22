import { artifactPlugin } from './define.js';
import { pair } from './pair.js';
import { summaryHtml, summaryMarkdown } from '@plugins/runtime/work/artifacts/summary-pages.js';
import { SUMMARY_ARTIFACT_SCHEMA } from '@plugins/runtime/work-tools/schema/summary.js';
import { parseSummary } from '@plugins/runtime/work-tools/parse-summary.js';
import type { SummaryArtifactInput } from '@/types/work/summary.js';

export const summaryArtifactPlugin = () =>
  artifactPlugin('artifact-summary', {
    key: 'summary',
    description:
      'summary: plain-language area blurbs (2–3 sentences each) plus only the significant files or folders that changed.',
    instructions:
      'Include summary for code changes: one short area blurb per touched surface (backend, frontend, modules, …), and only the main paths.',
    schema: SUMMARY_ARTIFACT_SCHEMA,
    parse: parseSummary,
    buildFiles: (payload, ctx) => {
      const summary = payload as SummaryArtifactInput;
      return pair('summary', summaryMarkdown(summary), summaryHtml(String(ctx.title), summary));
    },
  });
