import { describe, expect, it } from 'vitest';
import { waitForMinion } from './wait-minion.js';
import { createPendingStore } from './pending-store.js';
import { createStreamBackend } from '../../session/stream/backend.js';

describe('waitForMinion', () => {
  it('returns immediately when the minion already finished', async () => {
    const backend = createStreamBackend();
    await backend.create({
      id: 'm1',
      harness: 'cursor-cli',
      prompt: 'go',
      cwd: '/work',
      status: 'completed',
      runId: 'r',
      createdAt: 't',
      updatedAt: 't',
      transcript: 'all done',
    });
    const status = await waitForMinion({
      backend,
      pending: createPendingStore(),
      minionId: 'm1',
    });
    expect(status?.transcript).toBe('all done');
    expect(status?.status).toBe('completed');
  });
});
