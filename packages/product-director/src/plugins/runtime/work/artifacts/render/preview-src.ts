import { parseMermaidMarkdown } from './parse-mermaid-md.js';
import { renderMarkdownPage } from './md-page.js';
import { renderMermaidMarkdown } from './mermaid-md.js';

/** Apply document chrome + theme CSS to stored markdown; pass HTML through. */
export function previewSrcDoc(path: string, content: string): string {
  if (path.endsWith('.html')) return content;
  if (!path.endsWith('.md')) return content;
  if (parseMermaidMarkdown(content)) return renderMermaidMarkdown(path, content);
  return renderMarkdownPage(path, content);
}
