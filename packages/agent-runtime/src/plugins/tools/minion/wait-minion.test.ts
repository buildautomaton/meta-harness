import { describe, expect, it } from 'vitest';
import { waitForMinion } from './wait-minion.js';
import { createPendingStore } from './pending-store.js';
import { createStreamBackend } from '../../session/stream/backend.js';
import { createNotifierHub } from '../../../runtime/notify/hub.js';
import type { NotifierHub, NotifierSink } from '../../../types/notify.js';

function record(id: string, status: 'running' | 'completed') {
  return {
    id,
    harness: 'cursor-cli',
    prompt: 'go',
    cwd: '/work',
    status,
    runId: 'r',
    createdAt: 't',
    updatedAt: 't',
    transcript: status === 'completed' ? 'all done' : '',
  };
}

function notifyingHub(): { hub: NotifierHub; subscribed: Promise<void> } {
  const inner = createNotifierHub();
  let resume: () => void;
  const subscribed = new Promise<void>((resolve) => {
    resume = resolve;
  });
  return {
    subscribed,
    hub: {
      notify: (event) => inner.notify(event),
      ask: (request) => inner.ask(request),
      subscribe: (sink: NotifierSink) => {
        const unsub = inner.subscribe(sink);
        resume();
        return unsub;
      },
    },
  };
}

describe('waitForMinion', () => {
  it('returns immediately when the minion already finished', async () => {
    const backend = createStreamBackend();
    await backend.create(record('m1', 'completed'));
    const messages: string[] = [];
    const status = await waitForMinion({
      backend,
      pending: createPendingStore(),
      minionId: 'm1',
      extras: { reportProgress: ({ message }) => messages.push(message) },
    });
    expect(status?.transcript).toBe('all done');
    expect(status?.status).toBe('completed');
    expect(messages).toEqual([]);
  });

  it('does not report progress after the minion settles', async () => {
    const backend = createStreamBackend();
    await backend.create(record('m1', 'running'));
    const messages: string[] = [];
    const { hub, subscribed } = notifyingHub();
    const pending = waitForMinion({
      backend,
      pending: createPendingStore(),
      notifier: hub,
      minionId: 'm1',
      extras: { reportProgress: ({ message }) => messages.push(message) },
    });
    await subscribed;
    await backend.patch('m1', { status: 'completed', transcript: 'all done' });
    hub.notify({ minionId: 'm1', type: 'completed', message: 'Minion completed' });
    expect((await pending)?.status).toBe('completed');
    expect(messages).not.toContain('Minion completed');
  });
});
