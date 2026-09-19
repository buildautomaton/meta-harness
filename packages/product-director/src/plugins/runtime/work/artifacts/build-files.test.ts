import { describe, expect, it } from 'vitest';
import { builtinArtifactKinds } from '../../artifacts/builtins.js';
import { buildArtifactFiles } from './build-files.js';

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
              context: 'Modules in module-structure.md',
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
});
