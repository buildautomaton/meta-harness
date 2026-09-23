import { describe, expect, it } from 'vitest';
import { previewSrcDoc } from './preview-src.js';

describe('previewSrcDoc', () => {
  it('styles markdown tables and passes html through', () => {
    const html = previewSrcDoc(
      'api.md',
      '# API routes\n\n| | Method |\n| --- | --- |\n| <span class="change change-added">+</span> | `GET` |\n',
    );
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('change-added');
    expect(html).toContain('API routes');
    expect(previewSrcDoc('ui/x.html', '<html><body>hi</body></html>')).toBe('<html><body>hi</body></html>');
  });
});
