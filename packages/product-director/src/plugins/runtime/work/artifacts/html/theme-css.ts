import { OVERLAY_SCROLLBAR_CSS } from './overlay-scrollbar-css.js';
import { SECTION_CSS } from './section-css.js';

export const THEME_CSS = `
:root { color-scheme: dark; --bg:#101218; --panel:#171b24; --line:#2a3140; --text:#e8eaed; --muted:#9aa3b2; --accent:#7eb6ff; }
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.5 ui-sans-serif, system-ui, sans-serif; }
main, header { max-width: 960px; margin: 0 auto; padding: 24px 20px; }
header { border-bottom: 1px solid var(--line); }
.kicker { margin: 0 0 8px; color: var(--accent); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
h1, h2, h3 { line-height: 1.25; }
h1 { margin: 0 0 12px; font-size: 28px; }
h2 { margin: 32px 0 12px; font-size: 18px; }
p, pre, table { color: var(--muted); }
p { white-space: pre-wrap; }
a { color: var(--accent); }
pre { overflow: auto; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { color: var(--text); font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--line); font-size: 12px; }
.change { display: inline-flex; align-items: center; justify-content: center; width: 1.35em; height: 1.35em; border-radius: 999px; font-weight: 700; font-size: 13px; line-height: 1; vertical-align: middle; }
.change-icon { display: block; transform: translateY(-0.5px); }
.change-added { color: #0d2f18; background: #8ee09a; }
.change-modified { color: #3a2e0a; background: #f0d080; }
.change-removed { color: #3a1010; background: #f0a0a0; }
.path-list { list-style: none; margin: 0; padding: 0; }
.path-list li { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--line); }
.path-list li:last-child { border-bottom: 0; }
.diff .add, .diff .added { color: #8ee09a; }
.diff .del, .diff .removed { color: #f0a0a0; }
${SECTION_CSS}
${OVERLAY_SCROLLBAR_CSS}
`.trim();
