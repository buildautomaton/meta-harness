import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

describe('accept draft onto the queue', () => {
  it('queues a draft and ends an in-flight interview', async () => {
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
          { id: 'guest', label: 'Allow guest', recommended: true },
          { id: 'else', label: 'Something else' },
        ],
      },
    ]);
    await ready;
    const queued = await work.updateWork(draft.id, { queued: true });
    expect(queued?.status).toBe('queued');
    const round = await pending;
    expect(round.done).toBe(true);
    expect(round.item?.status).toBe('queued');
  });
});
