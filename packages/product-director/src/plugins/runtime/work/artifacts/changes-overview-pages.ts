import { wrapDocumentPage } from './html/wrap-document.js';
import { escapeHtml } from './html/escape.js';
import { changeMark, changeSymbol } from './change-mark.js';
import type { ChangesOverviewArtifactInput, ChangesOverviewGroupInput } from '@/types/work/changes-overview.js';

export function changesOverviewMarkdown(input: ChangesOverviewArtifactInput): string {
  const rows = input.groups.map((g) => `| ${formatPathsMd(g)} | ${g.description.replace(/\|/g, '\\|')} |`);
  return [
    '# Changes overview',
    '',
    '| Files | What changed |',
    '| --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

export function changesOverviewHtml(title: string, input: ChangesOverviewArtifactInput): string {
  const rows = input.groups.map((g) => groupRow(g)).join('\n');
  return wrapDocumentPage({
    title,
    kicker: 'Changes overview',
    bodyHtml: `<table class="changes-overview"><thead><tr><th>Files</th><th>What changed</th></tr></thead><tbody>${rows}</tbody></table>`,
  });
}

function formatPathsMd(group: ChangesOverviewGroupInput): string {
  return group.paths.map((p) => `${changeSymbol(p.change)} \`${p.path}\``).join(' · ');
}

function groupRow(group: ChangesOverviewGroupInput): string {
  const paths = group.paths
    .map(
      (p) =>
        `<li>${changeMark(p.change)} <code class="path path-${p.change}">${escapeHtml(p.path)}</code></li>`,
    )
    .join('');
  return `<tr><td class="changes-files"><div class="path-scroll"><ul class="path-list">${paths}</ul></div></td><td class="changes-summary">${escapeHtml(group.description)}</td></tr>`;
}
