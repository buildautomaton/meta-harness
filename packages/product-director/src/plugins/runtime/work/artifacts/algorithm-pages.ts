import { wrapDocumentPage } from './html/wrap-document.js';
import { escapeHtml } from './html/escape.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';

type Algorithm = NonNullable<SubmitWorkInput['algorithm']>;

export function algorithmMarkdown(algorithm: Algorithm): string {
  return [
    `# ${algorithm.name}`,
    '',
    '## What changed',
    '',
    algorithm.whatChanged,
    '',
    '## Pseudocode',
    '',
    '```',
    algorithm.pseudocode,
    '```',
    '',
  ].join('\n');
}

export function algorithmHtml(algorithm: Algorithm): string {
  const body = `
    <section class="section">
      <h2>What changed</h2>
      <p>${escapeHtml(algorithm.whatChanged)}</p>
    </section>
    <section class="section">
      <h2>Pseudocode</h2>
      <pre>${escapeHtml(algorithm.pseudocode)}</pre>
    </section>
  `;
  return wrapDocumentPage({ title: algorithm.name, kicker: 'Algorithm', bodyHtml: body });
}
