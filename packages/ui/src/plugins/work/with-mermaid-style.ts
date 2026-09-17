import { MERMAID_BOX_CSS } from '../../design/mermaid-box-css.js';
import { mermaidErPaintJs } from './mermaid-er-paint.js';
import { mermaidPaintJs } from './mermaid-paint.js';

export function withMermaidStyle(html: string): string {
  if (!html.includes('mermaid')) return html;
  let next = html;
  if (!next.includes('data-mh-mermaid-style')) {
    const tag = `<style data-mh-mermaid-style>${MERMAID_BOX_CSS}</style>`;
    next = next.includes('</head>') ? next.replace('</head>', `${tag}</head>`) : `${tag}${next}`;
  }
  if (!next.includes('data-mh-mermaid-paint')) {
    const tag = `<script data-mh-mermaid-paint>${mermaidPaintJs}${mermaidErPaintJs}</script>`;
    next = next.includes('</body>') ? next.replace('</body>', `${tag}</body>`) : `${next}${tag}`;
  }
  return next;
}
