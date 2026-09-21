import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';
import { DRAFT_ONLY } from '@/types/work/draft-only.js';

const question = {
  id: 'scope',
  prompt: 'Guest checkout?',
  context: 'Decide whether checkout requires an account.',
  choices: [
    { id: 'guest', label: 'Allow guest' },
    { id: 'account', label: 'Account required' },
  ],
};

describe('delete draft', () => {
  it('deletes a fresh draft', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.' });
    expect(await work.deleteWork(draft.id)).toBe(true);
    expect(await work.getWork(draft.id)).toBeNull();
  });

  it('deletes a draft after an agent session is attached', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.' });
    await work.attachSession(draft.id, 'interview-1');
    expect(await work.deleteWork(draft.id)).toBe(true);
    expect(await work.getWork(draft.id)).toBeNull();
  });

  it('deletes a draft while interview questions are waiting', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.' });
    const ready = new Promise<void>((resolve) => {
      work.subscribe((event) => {
        if (event.type === 'work.changed' && event.id === draft.id) resolve();
      });
    });
    const pending = work.submitInterview(draft.id, [question]);
    await ready;
    expect(await work.deleteWork(draft.id)).toBe(true);
    expect(await pending).toEqual({ done: true });
    expect(await work.getWork(draft.id)).toBeNull();
  });

  it('drops later interview updates on a deleted draft', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.' });
    await work.deleteWork(draft.id);
    expect(await work.submitInterview(draft.id, [question], 'session-1')).toEqual({ done: true });
    expect(await work.submitInterview(draft.id, [])).toEqual({ done: true });
    expect(await work.getWork(draft.id)).toBeNull();
    expect(await work.listWork()).toEqual([]);
  });

  it('refuses queued work', async () => {
    const work = createSqliteWorkBackend();
    const item = await work.addWork({ title: 'Ship it', queued: true });
    await expect(work.deleteWork(item.id)).rejects.toThrow(DRAFT_ONLY);
  });
});
