import type { ChangeKind } from '@/types/work/change.js';
import type { UiBannerInput } from '@/types/work/submit.js';
import { escapeHtml } from './html/escape.js';

const BANNER_CSS = `
.mh-change-banner { margin: 0 0 16px; padding: 12px 14px; border-left: 4px solid; font: 14px/1.45 ui-sans-serif, system-ui, sans-serif; white-space: pre-wrap; }
.mh-change-banner-added { color: #d9f5df; background: #163222; border-color: #8ee09a; }
.mh-change-banner-modified { color: #f7ecd0; background: #3a3010; border-color: #f0d080; }
.mh-change-banner-removed { color: #f7d5d5; background: #3a1515; border-color: #f0a0a0; }
`.trim();

export function wrapUiPreview(html: string, banner: UiBannerInput): string {
  const change = banner.change as ChangeKind;
  const style = `<style data-mh-ui-banner>${BANNER_CSS}</style>`;
  const el = `<div data-mh-change-banner class="mh-change-banner mh-change-banner-${change}" role="note">${escapeHtml(banner.text)}</div>`;
  let out = html.includes('data-mh-ui-banner') ? html : inject(html, style, '</head>');
  if (out.includes('data-mh-change-banner')) return out;
  if (/<body[^>]*>/i.test(out)) return out.replace(/<body([^>]*)>/i, `<body$1>${el}`);
  return `${el}${out}`;
}

function inject(html: string, tag: string, close: '</head>'): string {
  return html.includes(close) ? html.replace(close, `${tag}${close}`) : `${tag}${html}`;
}
