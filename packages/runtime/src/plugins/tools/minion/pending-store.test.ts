import { describe, expect, it } from 'vitest';
import { createPendingStore } from './pending-store.js';

describe('createPendingStore', () => {
  it('waits until complete and lists by minion', async () => {
    const pending = createPendingStore();
    const wait = pending.add({
      minionId: 'm1',
      requestId: 'r1',
      kind: 'permission',
      method: 'session/request_permission',
      title: 'Permission needed',
      message: 'run',
    });
    expect(pending.list('m1')).toHaveLength(1);
    expect(pending.complete('r1', { ok: true })).toBe(true);
    await expect(wait).resolves.toEqual({ ok: true });
    expect(pending.list('m1')).toEqual([]);
  });
});
