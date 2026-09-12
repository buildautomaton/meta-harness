import { describe, expect, it } from 'vitest';
import { createStreamBackend } from './stream-backend.js';

describe('createStreamBackend', () => {
  it('emits append events to subscribers', async () => {
    const store = createStreamBackend();
    const seen: string[] = [];
    await store.create({
      id: 's',
      harness: 'p',
      prompt: 'x',
      cwd: '/',
      status: 'running',
      runId: 'r',
      createdAt: 't',
      updatedAt: 't',
    });
    const unsub = store.subscribe?.('s', (event) => {
      seen.push(event.kind);
    });
    await store.append('s', { ts: 't', kind: 'update', payload: { text: 'n' } });
    expect(seen).toEqual(['update']);
    unsub?.();
  });
});
