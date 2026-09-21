import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

const question = {
  id: 'q1',
  prompt: 'Keep this layout?',
  context: 'Edit checkout.html',
  choices: [
    { id: 'keep', label: 'Keep' },
    { id: 'change', label: 'Change' },
  ],
};

describe('unqueue work', () => {
  it('clears a question-originated queued item like unselecting the answer', async () => {
    const work = createSqliteWorkBackend();
    const artifact = await work.recordSubmission({
      title: 'Checkout',
      description: 'Added checkout',
      project: 'Hiring',
      questions: { overview: [question] },
    });
    const queued = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'change' },
    ]);
    const id = queued.queued[0]!.id;
    expect(await work.updateWork(id, { unqueue: true })).toBeNull();
    expect(await work.getWork(id)).toBeNull();
    expect((await work.getArtifact(artifact.id))?.questions.__overview__?.[0]?.answerId).toBeNull();
  });

  it('sends a promoted draft back to draft', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.', project: 'Hiring' });
    await work.submitInterview(draft.id, []);
    expect((await work.getWork(draft.id))?.status).toBe('queued');
    const item = await work.updateWork(draft.id, { unqueue: true });
    expect(item?.status).toBe('draft');
    expect(item?.project).toBe('Hiring');
  });
});
