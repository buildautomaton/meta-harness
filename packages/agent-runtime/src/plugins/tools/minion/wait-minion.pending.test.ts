import { describe, expect, it } from 'vitest';
import { waitForMinion } from './wait-minion.js';
import { createPendingStore } from './pending-store.js';
import { createStreamBackend } from '@plugins/session/stream/backend.js';
import { createNotifierHub } from '@runtime/notify/hub.js';
import type { NotifierHub, NotifierSink } from '@/types/notify.js';

function record(id: string) {
  return {
    id,
    harness: 'cursor-cli',
    prompt: 'go',
    cwd: '/work',
    status: 'running' as const,
    runId: 'r',
    createdAt: 't',
    updatedAt: 't',
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

describe('waitForMinion pending permissions', () => {
  it('keeps the spawn call open until the minion finishes', async () => {
    const backend = createStreamBackend();
    await backend.create(record('m1'));
    const store = createPendingStore();
    void store.add({
      minionId: 'm1',
      requestId: 'r1',
      kind: 'permission',
      method: 'session/request_permission',
      title: 'Permission needed',
      message: 'npm test',
    });
    const { hub, subscribed } = notifyingHub();
    const waiting = waitForMinion({ backend, pending: store, notifier: hub, minionId: 'm1' });
    await subscribed;
    hub.notify({ minionId: 'm1', type: 'permission', message: 'Permission needed' });
    let done = false;
    void waiting.then(() => {
      done = true;
    });
    await new Promise((r) => setTimeout(r, 80));
    expect(done).toBe(false);
    await backend.patch('m1', { status: 'completed', transcript: 'all done' });
    hub.notify({ minionId: 'm1', type: 'completed', message: 'done' });
    expect((await waiting)?.status).toBe('completed');
  });
});
