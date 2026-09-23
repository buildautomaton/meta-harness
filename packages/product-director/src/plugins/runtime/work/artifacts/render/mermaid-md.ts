import { wrapMermaidPage } from '../html/wrap-mermaid.js';
import { parseMermaidMarkdown } from './parse-mermaid-md.js';
import { kickerForPath } from './kickers.js';
import { renderMarkdownPage } from './md-page.js';

export function renderMermaidMarkdown(path: string, markdown: string): string {
  const parts = parseMermaidMarkdown(markdown);
  if (!parts) return renderMarkdownPage(path, markdown);
  return wrapMermaidPage({
    title: parts.title,
    kicker: kickerForPath(path),
    whatChanged: parts.whatChanged,
    mermaid: parts.mermaid,
    highlights: parts.highlights,
  });
}
