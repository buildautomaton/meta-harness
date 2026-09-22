import { describe, expect, it } from 'vitest';
import { builtinArtifactKinds } from '../../artifacts/builtins.js';
import { buildArtifactFiles } from './build-files.js';
import { previewSrcDoc } from './render/preview-src.js';

describe('buildArtifactFiles order and banners', () => {
  it('stores non-ui as markdown, ui as html with change banner', () => {
    const files = buildArtifactFiles(
      {
        title: 'Cart',
        description: 'Updated cart row.',
        summary: { areas: [{ area: 'Frontend', description: 'Cart row price layout.' }] },
        changesOverview: {
          groups: [
            {
              description: 'Cart row now shows price beside quantity.',
              paths: [{ path: 'ui/cart-row.html', change: 'modified' }],
            },
          ],
        },
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
    expect(files.filter((f) => f.path.endsWith('.html')).map((f) => f.path)).toEqual(['ui/cart-row.html']);
    expect(files.filter((f) => f.path.endsWith('.md')).map((f) => f.path).sort()).toEqual([
      'algorithm.md',
      'api.md',
      'changes-overview.md',
      'data-model.md',
      'description.md',
      'summary.md',
    ]);
    const ui = files.find((f) => f.path === 'ui/cart-row.html')?.content ?? '';
    expect(ui).toContain('mh-change-banner-modified');
    expect(ui).toContain('Price sits beside quantity now.');
    const algo = previewSrcDoc(
      'algorithm.md',
      files.find((f) => f.path === 'algorithm.md')?.content ?? '',
    );
    expect(algo).toContain('What changed');
    expect(algo).not.toContain('class="panel"');
    const modelMd = files.find((f) => f.path === 'data-model.md')?.content ?? '';
    expect(modelMd).toContain('CART.total');
    expect(modelMd).toContain('```json highlights');
    const model = previewSrcDoc('data-model.md', modelMd);
    expect(model).toContain('CART.total');
    expect(model).toContain('class="section"');
    expect(model).toContain('What changed');
    expect(model).not.toContain('class="changed"');
  });
});
