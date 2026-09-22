export const UI_PAGES_DESCRIPTION =
  'One HTML preview per changed UI surface. A surface is a full screen, or a single component when the change was smaller. Preview only, in the app design system, with realistic mock data. Pass banner as structured JSON (not in the HTML); formatting is applied for you. The review questionnaire is the separate questions.ui param.';

export const UI_HTML_DESCRIPTION = [
  'Visual preview only: self-contained HTML for one changed UI screen or component.',
  'Match the app being built: same design system, typography, color, spacing, and component look.',
  'If the change was a small component, preview that component — not an entire page.',
  'Do not add New badges, change stickers, or summary banners in the HTML — those come from the banner object.',
  'Fill it with realistic mock data for this product’s scenarios and use cases',
  '(real names, amounts, statuses, dates), not lorem ipsum or generic placeholders.',
  'Inline CSS and JS. No app bundler. Icons and images go in assets and are referenced by filename (src or url()).',
  'Those files are inlined as data URIs so the HTML stays self-contained. CDN fonts are OK.',
  'Include radios, forms, notes, submit buttons, or iframes when those exist in the product UI.',
  'This HTML does not need a review questionnaire; pass that in the questions param, which is shown below the preview.',
  'Each pages entry is one surface — split unrelated screens or components into several entries.',
].join(' ');

export const UI_FILENAME_DESCRIPTION = 'Simple .html filename with no path, e.g. checkout.html or price-row.html';
export const UI_TITLE_DESCRIPTION = 'Human-readable name of this screen or component';
export const UI_BANNER_DESCRIPTION =
  'Structured change summary rendered as a colored banner above the mockup. Do not put this text or badges in the HTML.';
export const UI_BANNER_TEXT_DESCRIPTION =
  'At most a couple of plain-language sentences on what changed on this surface.';
export const UI_BANNER_CHANGE_DESCRIPTION =
  'added (green), modified (yellow), or removed (red). Controls banner color only.';
export const UI_INSTRUCTIONS = [
  'Include ui whenever any user-facing screen or component changed — summary/changesOverview are not a substitute for the HTML mockup.',
  'UI previews are self-contained HTML in the same style and design system as the app being built.',
  'Preview a changed screen, or a changed component when the scope was smaller.',
  'Pass banner: { change, text } as JSON next to html — never draw New badges or banners inside the mockup.',
  'Use realistic mock data for this product’s scenarios and use cases. Include the product’s own controls.',
  'Include icons and images via the assets param (filename, mimeType, base64) or POST /api/assets with sessionId.',
  'The HTML does not need a review questionnaire — that is the separate questions param.',
].join(' ');
