import { OVERLAY_SCROLLBAR_CSS } from './overlay-scrollbar-css.js';

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
.panel { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; margin: 16px 0; }
pre { overflow: auto; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { color: var(--text); font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--line); font-size: 12px; }
.changed { color: var(--text); background: #1d2a3a; border-left: 3px solid var(--accent); padding: 12px 14px; border-radius: 8px; }
.diff .add, .diff .added { color: #8ee09a; }
.diff .del, .diff .removed { color: #f0a0a0; }
${OVERLAY_SCROLLBAR_CSS}
`.trim();
