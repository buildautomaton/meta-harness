import { escapeHtml, escapeScriptText } from './escape.js';
import { MERMAID_BOX_CSS } from './mermaid-css.js';
import { mermaidInit } from './mermaid-init.js';
import { mermaidErPaintJs } from './mermaid-er-paint.js';
import { mermaidPaintJs } from './mermaid-paint.js';
import { THEME_CSS } from './theme-css.js';

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
}): string {
  return `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><title>${escapeHtml(opts.title)}</title>
  <style>${PAGE_CSS}</style>
</head><body>
  <main>
    <p class="kicker">${escapeHtml(opts.kicker)}</p>
    <h1>${escapeHtml(opts.title)}</h1>
    <p class="changed">${escapeHtml(opts.whatChanged)}</p>
    <pre class="mermaid" id="diagram"></pre>
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
  </main>
</body></html>`;
}
