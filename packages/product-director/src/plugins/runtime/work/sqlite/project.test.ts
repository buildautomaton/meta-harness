import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

describe('work project', () => {
  it('stores project on drafts, submissions, and follow-up queue items', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Tiles', content: 'Overlay text.', project: 'Hiring' });
    expect(draft.project).toBe('Hiring');

    const artifact = await work.recordSubmission({
      title: 'Tiles',
      description: 'Overlay on submissions',
      project: 'Hiring',
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep this overlay?',
            context: '',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Change' },
            ],
          },
        ],
      },
    });
    expect(artifact.project).toBe('Hiring');
    const queued = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'change' },
    ]);
    expect(queued.queued[0]?.project).toBe('Hiring');
  });

  it('assigns a project onto a draft and an artifact', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Tiles', content: 'Overlay.' });
    expect((await work.updateWork(draft.id, { project: 'Studio' }))?.project).toBe('Studio');
    const artifact = await work.recordSubmission({ title: 'Tiles', description: 'Overlay' });
    expect((await work.updateArtifact(artifact.id, { project: 'Hiring' }))?.project).toBe('Hiring');
  });
});
