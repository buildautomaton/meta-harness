import { escapeHtml } from './html/escape.js';
import { changeMark } from './change-mark.js';
import type { ChangesOverviewArtifactInput, ChangesOverviewGroupInput } from '@/types/work/changes-overview.js';

export function changesOverviewMarkdown(input: ChangesOverviewArtifactInput): string {
  const rows = input.groups.map((g) => groupRow(g)).join('\n');
  return [
    '# Changes overview',
    '',
    `<table class="changes-overview"><thead><tr><th>Files</th><th>What changed</th></tr></thead><tbody>`,
    rows,
    `</tbody></table>`,
    '',
  ].join('\n');
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
