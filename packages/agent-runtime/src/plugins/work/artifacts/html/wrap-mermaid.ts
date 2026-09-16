import { escapeHtml, escapeScriptText } from './escape.js';
import { mermaidInit } from './mermaid-init.js';

const PAGE_CSS = `
:root { color-scheme: light; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #f7f8fa; color: #0f172a; }
body { font: 15px/1.5 ui-sans-serif, system-ui, sans-serif; }
main { max-width: 960px; margin: 0 auto; padding: 28px 24px; }
.kicker { margin: 0 0 6px; color: #64748b; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
h1 { margin: 0 0 10px; font-size: 22px; }
.changed { margin: 0 0 16px; color: #475569; }
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
  </main>
</body></html>`;
}
