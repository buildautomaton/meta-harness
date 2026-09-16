import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

describe('sqlite work backend', () => {
  it('queues draft work, picks it with a session, and stores artifacts', async () => {
    const work = createSqliteWorkBackend();
    const item = await work.addWork({ title: 'Ship checkout', content: 'Build the checkout flow.' });
    expect(item.status).toBe('draft');
    expect(item.sessionIds).toEqual([]);

    const picked = await work.pickNextWork('session-1');
    expect(picked?.id).toBe(item.id);
    expect(picked?.status).toBe('in_progress');
    expect(picked?.sessionIds).toContain('session-1');

    const artifact = await work.recordSubmission({
      title: 'Checkout',
      description: 'Added checkout page',
      sessionId: 'session-1',
      ui: { pages: [{ filename: 'checkout.html', title: 'Checkout', html: '<html></html>' }] },
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep this layout?',
            context: 'Checkout lives in ui/checkout.html',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Change' },
            ],
          },
        ],
      },
    });
    expect(artifact.kinds).toContain('ui');
    expect(artifact.files.some((f) => f.path === 'ui/checkout.html')).toBe(true);
    expect(artifact.questions.__overview__?.[0]?.id).toBe('q1');

    await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'keep' },
    ]);
    const answered = await work.getArtifact(artifact.id);
    expect(answered?.questions.__overview__?.[0]?.answerId).toBe('keep');
  });
});
