import { MERMAID_BOX_CSS, OVERLAY_SCROLLBAR_CSS } from '@buildautomaton/ui-runtime';
import { mermaidErPaintJs } from './mermaid-er-paint.js';
import { mermaidPaintJs } from './mermaid-paint.js';

function inject(html: string, attr: string, tag: string, close: '</head>' | '</body>'): string {
  if (html.includes(attr)) return html;
  if (html.includes(close)) return html.replace(close, `${tag}${close}`);
  return close === '</head>' ? `${tag}${html}` : `${html}${tag}`;
}

export function withMermaidStyle(html: string): string {
  const bar = `<style data-mh-scrollbar>${OVERLAY_SCROLLBAR_CSS}</style>`;
  let next = inject(html, 'data-mh-scrollbar', bar, '</head>');
  if (!next.includes('mermaid')) return next;
  const css = `<style data-mh-mermaid-style>${MERMAID_BOX_CSS}</style>`;
  const js = `<script data-mh-mermaid-paint>${mermaidPaintJs}${mermaidErPaintJs}</script>`;
  next = inject(next, 'data-mh-mermaid-style', css, '</head>');
  return inject(next, 'data-mh-mermaid-paint', js, '</body>');
}
