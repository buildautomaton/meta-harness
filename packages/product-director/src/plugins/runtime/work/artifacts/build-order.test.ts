import { describe, expect, it } from 'vitest';
import { builtinArtifactKinds } from '../../artifacts/builtins.js';
import { buildArtifactFiles } from './build-files.js';

describe('buildArtifactFiles order and banners', () => {
  it('orders html previews and wraps ui with a change banner', () => {
    const files = buildArtifactFiles(
      {
        title: 'Cart',
        description: 'Updated cart row.',
        summary: { areas: [{ area: 'Frontend', description: 'Cart row price layout.' }] },
        api: {
          routes: [{ method: 'GET', path: '/api/cart', change: 'modified', description: 'Returns totals' }],
        },
        dataModel: {
          mermaid: 'erDiagram\n  CART {\n    string total\n  }',
          whatChanged: 'Added total.',
          highlights: [{ ref: 'CART.total', change: 'added' }],
        },
        ui: {
          pages: [
            {
              filename: 'cart-row.html',
              title: 'Cart row',
              html: '<!doctype html><html><body><div>row</div></body></html>',
              banner: { change: 'modified', text: 'Price sits beside quantity now.' },
            },
          ],
        },
        algorithm: {
          name: 'Tax',
          whatChanged: 'Uses cart total.',
          pseudocode: 'return total * rate',
        },
      },
      '2026-01-01T00:00:00.000Z',
      [],
      builtinArtifactKinds(),
    );
    expect(files.filter((f) => f.path.endsWith('.html')).map((f) => f.path)).toEqual([
      'summary.html',
      'api.html',
      'data-model.html',
      'ui/cart-row.html',
      'algorithm.html',
    ]);
    const ui = files.find((f) => f.path === 'ui/cart-row.html')?.content ?? '';
    expect(ui).toContain('mh-change-banner-modified');
    expect(ui).toContain('Price sits beside quantity now.');
    const algo = files.find((f) => f.path === 'algorithm.html')?.content ?? '';
    expect(algo).toContain('class="section"');
    expect(algo).not.toContain('class="panel"');
    expect(algo).not.toContain('class="changed"');
    const model = files.find((f) => f.path === 'data-model.html')?.content ?? '';
    expect(model).toContain('CART.total');
    expect(model).toContain('class="section"');
    expect(model).toContain('What changed');
    expect(model).not.toContain('class="changed"');
  });
});
