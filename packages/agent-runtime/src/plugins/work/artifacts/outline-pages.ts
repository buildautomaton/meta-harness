import { wrapDocumentPage } from './html/wrap-document.js';
import { escapeHtml } from './html/escape.js';
import type { OutlineArtifactInput, OutlineViewInput } from '@/types/work/outline.js';

function viewBody(view: OutlineViewInput): string {
  const cls = view.kind === 'diff' ? 'diff' : 'tree';
  return `<pre class="${cls}">${escapeHtml(view.content)}</pre>`;
}

export function outlineMarkdown(outline: OutlineArtifactInput): string {
  const views = outline.views.map((view) => [`## ${view.title}`, '', '```', view.content, '```', ''].join('\n'));
  return ['# Change outline', '', '## What changed', '', outline.whatChanged, '', ...views].join('\n');
}

export function outlineHtml(title: string, outline: OutlineArtifactInput): string {
  const views = outline.views
    .map((view) => `<section class="panel"><h2>${escapeHtml(view.title)}</h2>${viewBody(view)}</section>`)
    .join('\n');
  const body = `<section class="panel changed"><h2>What changed</h2><p>${escapeHtml(outline.whatChanged)}</p></section>${views}`;
  return wrapDocumentPage({ title, kicker: 'Change outline', bodyHtml: body });
}
