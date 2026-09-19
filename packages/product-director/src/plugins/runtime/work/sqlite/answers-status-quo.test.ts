import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

const questions = {
  overview: [
    {
      id: 'q1',
      prompt: 'Keep this layout?',
      context: '',
      choices: [
        { id: 'keep', label: 'Keep the current layout', kind: 'status_quo' as const },
        {
          id: 'change',
          label: 'Use two columns',
          kind: 'change' as const,
          prompt: 'Switch checkout to two columns',
          context: 'Edit ui/checkout.html',
        },
      ],
    },
  ],
};

describe('status_quo review answers', () => {
  it('records the answer without queuing follow-up work', async () => {
    const work = createSqliteWorkBackend();
    const artifact = await work.recordSubmission({ title: 'Checkout', description: 'Added checkout', questions });
    const kept = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'keep' },
    ]);
    expect(kept.queued).toHaveLength(0);
    expect((await work.listWork()).filter((item) => item.status === 'queued')).toHaveLength(0);
    expect((await work.getArtifact(artifact.id))?.questions.__overview__?.[0]?.answerId).toBe('keep');
  });

  it('drops queued work when the answer is switched to status_quo', async () => {
    const work = createSqliteWorkBackend();
    const artifact = await work.recordSubmission({ title: 'Checkout', description: 'Added checkout', questions });
    const queued = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'change' },
    ]);
    expect(queued.queued[0]?.origin.kind).toBe('question');
    expect(queued.queued[0]?.prompt).toBe('Switch checkout to two columns');
    const kept = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'keep' },
    ]);
    expect(kept.queued).toHaveLength(0);
    expect(kept.removed).toEqual([queued.queued[0]?.id]);
  });
});
