import { wrapDocumentPage } from './html/wrap-document.js';
import { escapeHtml } from './html/escape.js';
import { changeMark, changeSymbol } from './change-mark.js';
import type { SummaryArtifactInput } from '@/types/work/summary.js';

export function summaryMarkdown(summary: SummaryArtifactInput): string {
  const areas = summary.areas.map((a) => `## ${a.area}\n\n${a.description}\n`);
  const paths = summary.paths?.length
    ? [
        '## Significant paths',
        '',
        ...summary.paths.map((p) => `- ${changeSymbol(p.change)} \`${p.path}\``),
        '',
      ]
    : [];
  return ['# Summary', '', ...areas, ...paths].join('\n');
}

export function summaryHtml(title: string, summary: SummaryArtifactInput): string {
  const areas = summary.areas
    .map(
      (a) =>
        `<section class="section"><h2>${escapeHtml(a.area)}</h2><p>${escapeHtml(a.description)}</p></section>`,
    )
    .join('\n');
  const paths = summary.paths?.length
    ? `<section class="section"><h2>Significant paths</h2><ul class="path-list">${summary.paths
        .map((p) => `<li>${changeMark(p.change)} <code>${escapeHtml(p.path)}</code></li>`)
        .join('')}</ul></section>`
    : '';
  return wrapDocumentPage({ title, kicker: 'Summary', bodyHtml: `${areas}${paths}` });
}
