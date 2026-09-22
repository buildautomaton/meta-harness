import { marked } from 'marked';
import { wrapDocumentPage } from '../html/wrap-document.js';
import { kickerForPath } from './kickers.js';

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdownPage(path: string, markdown: string): string {
  const title = firstHeading(markdown) || pathLabel(path);
  const bodyHtml = marked.parse(markdown, { async: false }) as string;
  return wrapDocumentPage({ title, kicker: kickerForPath(path), bodyHtml: stripLeadingH1(bodyHtml) });
}

function firstHeading(md: string): string | undefined {
  const match = md.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}

function pathLabel(path: string): string {
  return (path.split(/[/\\]/).pop() ?? path).replace(/\.(md|html)$/i, '');
}

function stripLeadingH1(html: string): string {
  return html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
}
