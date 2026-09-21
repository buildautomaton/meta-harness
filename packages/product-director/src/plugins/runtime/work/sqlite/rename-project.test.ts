import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

describe('renameProject', () => {
  it('renames work items and artifacts together', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Tiles', content: 'Overlay.', project: 'Hiring' });
    const artifact = await work.recordSubmission({
      title: 'Tiles',
      description: 'Overlay',
      project: 'Hiring',
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep?',
            context: '',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Change' },
            ],
          },
        ],
      },
    });
    await work.renameProject('Hiring', 'Studio');
    expect((await work.getWork(draft.id))?.project).toBe('Studio');
    expect((await work.getArtifact(artifact.id))?.project).toBe('Studio');
  });
});
