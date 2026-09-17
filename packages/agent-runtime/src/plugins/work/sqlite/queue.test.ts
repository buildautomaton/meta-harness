import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

describe('queued work order', () => {
  it('moves items to the top and pauses pick-up', async () => {
    const work = createSqliteWorkBackend();
    const first = await work.addWork({ title: 'A', queued: true });
    const second = await work.addWork({ title: 'B', queued: true });
    await work.updateWork(second.id, { queue: 'top' });
    const listed = await work.listWork({ status: 'queued' });
    expect(listed[0]?.id).toBe(second.id);
    await work.updateWork(second.id, { paused: true });
    const picked = await work.pickNextWork('s1');
    expect(picked?.id).toBe(first.id);
  });
});
