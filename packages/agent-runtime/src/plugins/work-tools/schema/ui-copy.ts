export const UI_PAGES_DESCRIPTION =
  'One HTML preview per changed UI surface. A surface is a full screen, or a single component when the change was smaller. Preview only, in the app design system, with realistic mock data. The review questionnaire is the separate questions.ui param — the HTML does not need to include it.';

export const UI_HTML_DESCRIPTION = [
  'Visual preview only: self-contained HTML for one changed UI screen or component.',
  'Match the app being built: same design system, typography, color, spacing, and component look.',
  'If the change was a small component, preview that component — not an entire page.',
  'Fill it with realistic mock data for this product’s scenarios and use cases',
  '(real names, amounts, statuses, dates), not lorem ipsum or generic placeholders.',
  'Inline CSS and JS. No app bundler, no local asset URLs. CDN fonts or icons are OK.',
  'Include radios, forms, notes, submit buttons, or iframes when those exist in the product UI.',
  'This HTML does not need a review questionnaire; pass that in the questions param, which is shown below the preview.',
  'Each pages entry is one surface — split unrelated screens or components into several entries.',
].join(' ');

export const UI_FILENAME_DESCRIPTION = 'Simple .html filename with no path, e.g. checkout.html or price-row.html';
export const UI_TITLE_DESCRIPTION = 'Human-readable name of this screen or component';
