import { wrapDocumentPage } from './html/wrap-document.js';
import { escapeHtml } from './html/escape.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';

export function backendHtml(title: string, description: string): string {
  return wrapDocumentPage({
    title,
    kicker: 'Backend',
    bodyHtml: `<section class="panel"><p>${escapeHtml(description)}</p></section>`,
  });
}

export function mermaidMarkdown(whatChanged: string, mermaid: string): string {
  return ['## What changed', '', whatChanged, '', '```mermaid', mermaid.trim(), '```', ''].join('\n');
}

export function apiMarkdown(api: NonNullable<SubmitWorkInput['api']>): string {
  const rows = api.routes.map((r) => `| ${r.method} | ${r.path} | ${r.change} | ${r.description} |`);
  return ['# API routes', '', '| Method | Path | Change | Description |', '| --- | --- | --- | --- |', ...rows, ''].join(
    '\n',
  );
}

export function apiHtml(title: string, api: NonNullable<SubmitWorkInput['api']>): string {
  const rows = api.routes
    .map(
      (r) =>
        `<tr><td><span class="badge">${escapeHtml(r.method)}</span></td><td><code>${escapeHtml(r.path)}</code></td><td>${escapeHtml(r.change)}</td><td>${escapeHtml(r.description)}</td></tr>`,
    )
    .join('\n');
  return wrapDocumentPage({
    title,
    kicker: 'API routes',
    bodyHtml: `<table><thead><tr><th>Method</th><th>Path</th><th>Change</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`,
  });
}
