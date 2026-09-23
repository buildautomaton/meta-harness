import { describe, expect, it } from 'vitest';
import { builtinArtifactKinds } from '../../artifacts/builtins.js';
import { buildArtifactFiles } from './build-files.js';
import { previewSrcDoc } from './render/preview-src.js';

describe('buildArtifactFiles', () => {
  it('writes markdown and questions without non-ui html', () => {
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
    expect(paths).not.toContain('data-model.html');
    expect(paths).toContain('questions.json');
    const md = files.find((f) => f.path === 'data-model.md')?.content ?? '';
    expect(md).toContain('```mermaid');
    expect(previewSrcDoc('data-model.md', md)).toContain('mermaid');
  });

  it('renders summary and api change marks at preview time', () => {
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
    const summaryMd = files.find((f) => f.path === 'summary.md')?.content ?? '';
    const overviewMd = files.find((f) => f.path === 'changes-overview.md')?.content ?? '';
    const apiMd = files.find((f) => f.path === 'api.md')?.content ?? '';
    expect(summaryMd).toContain('Backend');
    expect(summaryMd).not.toContain('src/checkout/');
    const summary = previewSrcDoc('summary.md', summaryMd);
    const overview = previewSrcDoc('changes-overview.md', overviewMd);
    const api = previewSrcDoc('api.md', apiMd);
    expect(summary).toContain('Backend');
    expect(summary).toContain('<h2');
    expect(overview).toContain('change-added');
    expect(overview).toContain('src/checkout/');
    expect(overview).toContain('changes-overview');
    expect(overview).toContain('path-scroll');
    expect(overview).toContain('table-layout: fixed');
    expect(overview).toContain('flex: 0 0 18px');
    expect(overview).toContain('max-height: 7.5em');
    expect(api).toContain('change-added');
    expect(api).not.toContain('>added<');
  });
});
