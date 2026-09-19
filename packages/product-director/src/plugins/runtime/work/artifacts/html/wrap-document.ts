import { escapeHtml } from './escape.js';
import { THEME_CSS } from './theme-css.js';

export function wrapDocumentPage(opts: { title: string; kicker: string; bodyHtml: string }): string {
  const title = escapeHtml(opts.title);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>${THEME_CSS}</style>
</head>
<body>
  <header>
    <p class="kicker">${escapeHtml(opts.kicker)}</p>
    <h1>${title}</h1>
  </header>
  <main>
    ${opts.bodyHtml}
  </main>
</body>
</html>
`;
}
