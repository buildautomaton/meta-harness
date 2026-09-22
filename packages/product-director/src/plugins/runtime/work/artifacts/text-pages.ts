import { wrapDocumentPage } from './html/wrap-document.js';
import { escapeHtml } from './html/escape.js';
import { changeMark, changeSymbol } from './change-mark.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';

export function mermaidMarkdown(whatChanged: string, mermaid: string): string {
  return ['## What changed', '', whatChanged, '', '```mermaid', mermaid.trim(), '```', ''].join('\n');
}

export function apiMarkdown(api: NonNullable<SubmitWorkInput['api']>): string {
  const rows = api.routes.map(
    (r) => `| ${changeSymbol(r.change)} | ${r.method} | ${r.path} | ${r.description} |`,
  );
  return [
    '# API routes',
    '',
    '| | Method | Path | Description |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

export function apiHtml(title: string, api: NonNullable<SubmitWorkInput['api']>): string {
  const rows = api.routes
    .map(
      (r) =>
        `<tr><td>${changeMark(r.change)}</td><td><span class="badge">${escapeHtml(r.method)}</span></td><td><code>${escapeHtml(r.path)}</code></td><td>${escapeHtml(r.description)}</td></tr>`,
    )
    .join('\n');
  return wrapDocumentPage({
    title,
    kicker: 'API routes',
    bodyHtml: `<table><thead><tr><th></th><th>Method</th><th>Path</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`,
  });
}
