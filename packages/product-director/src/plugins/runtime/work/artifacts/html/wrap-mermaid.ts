import { escapeHtml, escapeScriptText } from './escape.js';
import { MERMAID_BOX_CSS } from './mermaid-css.js';
import { mermaidInit } from './mermaid-init.js';
import { mermaidErPaintJs } from './mermaid-er-paint.js';
import { mermaidPaintJs } from './mermaid-paint.js';
import { mermaidHighlightPaintJs } from './mermaid-highlight-paint.js';
import { THEME_CSS } from './theme-css.js';
import type { DataModelHighlight } from '@/types/work/data-model.js';

const PAGE_CSS = `
${THEME_CSS}
pre.mermaid { background: transparent; border: 0; padding: 8px 0; overflow: visible; }
.mermaid { margin: 0; }
${MERMAID_BOX_CSS}
`.trim();

export function wrapMermaidPage(opts: {
  title: string;
  kicker: string;
  whatChanged: string;
  mermaid: string;
  highlights?: DataModelHighlight[];
}): string {
  const highlights = JSON.stringify(opts.highlights ?? []);
  return `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><title>${escapeHtml(opts.title)}</title>
  <style>${PAGE_CSS}</style>
</head><body>
  <main>
    <p class="kicker">${escapeHtml(opts.kicker)}</p>
    <h1>${escapeHtml(opts.title)}</h1>
    <section class="section">
      <h2>What changed</h2>
      <p>${escapeHtml(opts.whatChanged)}</p>
    </section>
    <pre class="mermaid" id="diagram"></pre>
    <script type="application/json" id="diagram-highlights">${escapeScriptText(highlights)}</script>
    <script type="text/plain" id="diagram-src">${escapeScriptText(opts.mermaid)}</script>
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
      mermaid.initialize(${JSON.stringify(mermaidInit)});
      const node = document.getElementById('diagram');
      node.textContent = document.getElementById('diagram-src').textContent;
      await mermaid.run({ nodes: [node] });
    </script>
    <script>${mermaidPaintJs}</script>
    <script>${mermaidErPaintJs}</script>
    <script>${mermaidHighlightPaintJs}</script>
  </main>
</body></html>`;
}
