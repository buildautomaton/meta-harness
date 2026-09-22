import { wrapDocumentPage } from './html/wrap-document.js';
import { escapeHtml } from './html/escape.js';
import type { SummaryArtifactInput } from '@/types/work/summary.js';

export function summaryMarkdown(summary: SummaryArtifactInput): string {
  const areas = summary.areas.map((a) => `## ${a.area}\n\n${a.description}\n`);
  return ['# Summary', '', ...areas].join('\n');
}

export function summaryHtml(title: string, summary: SummaryArtifactInput): string {
  const areas = summary.areas
    .map(
      (a) =>
        `<section class="section"><h2>${escapeHtml(a.area)}</h2><p>${escapeHtml(a.description)}</p></section>`,
    )
    .join('\n');
  return wrapDocumentPage({ title, kicker: 'Summary', bodyHtml: areas });
}
