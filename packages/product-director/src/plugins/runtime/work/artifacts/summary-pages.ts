import type { SummaryArtifactInput } from '@/types/work/summary.js';

export function summaryMarkdown(summary: SummaryArtifactInput): string {
  const areas = summary.areas.map((a) => `## ${a.area}\n\n${a.description}\n`);
  return ['# Summary', '', ...areas].join('\n');
}
