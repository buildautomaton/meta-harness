import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';
import { ANSWER_LOCKED } from './source-key.js';

describe('clearing a review answer', () => {
  it('removes queued follow-up work until an agent picks it up', async () => {
    const work = createSqliteWorkBackend(':memory:');
    const artifact = await work.recordSubmission({
      title: 'Checkout',
      description: 'Added checkout',
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep this layout?',
            context: 'Edit checkout.html',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Change' },
            ],
          },
        ],
      },
    });
    const queued = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'change' },
    ]);
    expect(queued.queued).toHaveLength(1);
    const cleared = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: '' },
    ]);
    expect(cleared.removed).toEqual([queued.queued[0]?.id]);
    expect((await work.listWork()).filter((item) => item.status === 'queued')).toHaveLength(0);
    expect((await work.getArtifact(artifact.id))?.questions.__overview__?.[0]?.answerId).toBeNull();
  });

  it('locks the answer after pickup so clear cannot delete in-progress work', async () => {
    const work = createSqliteWorkBackend(':memory:');
    const artifact = await work.recordSubmission({
      title: 'Checkout',
      description: 'Added checkout',
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep this layout?',
            context: 'Edit checkout.html',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Change' },
            ],
          },
        ],
      },
    });
    const queued = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'change' },
    ]);
    const picked = await work.pickNextWork('session-2');
    expect(picked?.id).toBe(queued.queued[0]?.id);
    const loaded = await work.getArtifact(artifact.id);
    expect(loaded?.questions.__overview__?.[0]?.locked).toBe(true);
    await expect(
      work.answerQuestions(artifact.id, [{ subject: '__overview__', questionId: 'q1', choiceId: '' }]),
    ).rejects.toThrow(ANSWER_LOCKED);
    expect(await work.getWork(picked!.id)).toMatchObject({ status: 'in_progress' });
    expect((await work.getArtifact(artifact.id))?.questions.__overview__?.[0]?.answerId).toBe('change');
  });
});
