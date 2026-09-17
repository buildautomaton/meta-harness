import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

describe('draft interview', () => {
  it('records answers as decisions and queues when the interview ends', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.' });
    const ready = new Promise<void>((resolve) => {
      work.subscribe((event) => {
        if (event.type === 'work.changed' && event.id === draft.id) resolve();
      });
    });
    const pending = work.submitInterview(draft.id, [
      {
        id: 'scope',
        prompt: 'Guest checkout?',
        context: 'Decide whether checkout requires an account.',
        choices: [
          { id: 'guest', label: 'Allow guest' },
          { id: 'account', label: 'Account required' },
        ],
      },
    ]);
    await ready;
    await work.answerWorkQuestions(draft.id, [{ subject: '__draft__', questionId: 'scope', choiceId: 'guest' }]);
    const round = await pending;
    expect(round.done).toBe(false);
    expect(round.answers?.[0]?.label).toBe('Allow guest');
    expect(round.item.decisions[0]).toContain('Allow guest');

    const done = await work.submitInterview(draft.id, []);
    expect(done.done).toBe(true);
    expect(done.item.status).toBe('queued');
  });
});
