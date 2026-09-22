import { describe, expect, it } from 'vitest';
import { builtinArtifactKinds } from '../../artifacts/builtins.js';
import { buildArtifactFiles } from './build-files.js';
import { apiHtml } from './text-pages.js';
import { summaryHtml } from './summary-pages.js';

describe('buildArtifactFiles', () => {
  it('writes markdown, mermaid html, and questions', () => {
    const files = buildArtifactFiles(
      {
        title: 'Model',
        description: 'New schema',
        dataModel: { mermaid: 'erDiagram\n  USER ||--o{ ORDER : places', whatChanged: 'Added orders' },
        questions: {
          modules: [
            {
              id: 'm1',
              prompt: 'Keep this split?',
              context: 'Modules in summary',
              choices: [
                { id: 'keep', label: 'Keep' },
                { id: 'merge', label: 'Merge' },
              ],
            },
          ],
        },
      },
      '2026-01-01T00:00:00.000Z',
      [],
      builtinArtifactKinds(),
    );
    const paths = files.map((f) => f.path);
    expect(paths).toContain('description.md');
    expect(paths).toContain('data-model.md');
    expect(paths).toContain('data-model.html');
    expect(paths).toContain('questions.json');
    expect(files.find((f) => f.path === 'data-model.html')?.content).toContain('mermaid');
  });

  it('renders summary and api change marks', () => {
    const files = buildArtifactFiles(
      {
        title: 'Routes',
        description: 'Shipped checkout routes.',
        api: {
          routes: [
            {
              method: 'POST',
              path: '/api/checkout',
              change: 'added',
              description: 'Starts checkout',
            },
          ],
        },
        summary: {
          areas: [{ area: 'Backend', description: 'Added checkout session create.' }],
        },
        changesOverview: {
          groups: [
            {
              description: 'New checkout session create and supporting folder.',
              paths: [{ path: 'src/checkout/', change: 'added' }],
            },
          ],
        },
      },
      '2026-01-01T00:00:00.000Z',
      [],
      builtinArtifactKinds(),
    );
    const summary = files.find((f) => f.path === 'summary.html')?.content ?? '';
    const overview = files.find((f) => f.path === 'changes-overview.html')?.content ?? '';
    const api = files.find((f) => f.path === 'api.html')?.content ?? '';
    expect(summary).toContain('Backend');
    expect(summary).not.toContain('src/checkout/');
    expect(summary).toContain('class="section"');
    expect(summary).not.toContain('class="panel"');
    expect(overview).toContain('change-added');
    expect(overview).toContain('src/checkout/');
    expect(overview).toContain('changes-overview');
    expect(overview).toContain('path-scroll');
    expect(overview).toContain('table-layout: fixed');
    expect(overview).toContain('flex: 0 0 18px');
    expect(overview).toContain('max-height: 7.5em');
    expect(api).toContain('change-added');
    expect(api).not.toContain('>added<');
    expect(apiHtml('x', { routes: [{ method: 'DELETE', path: '/x', change: 'removed', description: 'gone' }] })).toContain(
      'change-removed',
    );
    expect(summaryHtml('x', { areas: [{ area: 'Frontend', description: 'Tweaked cart.' }] })).toContain('Frontend');
  });
});
