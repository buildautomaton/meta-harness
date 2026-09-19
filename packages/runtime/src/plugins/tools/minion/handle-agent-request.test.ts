import { describe, expect, it } from 'vitest';
import { handleAgentRequest } from './handle-agent-request.js';
import { createPendingStore } from './pending-store.js';
import { createStreamBackend } from '@plugins/session/stream/backend.js';
import type { MinionEvent } from '@/types/notify.js';

describe('handleAgentRequest', () => {
  it('notifies and waits for the coordinator to apply its permission mode', async () => {
    const backend = createStreamBackend();
    await backend.create({
      id: 'm1',
      harness: 'cursor-cli',
      prompt: 'do',
      cwd: '/work',
      status: 'running',
      runId: 'r',
      createdAt: 't',
      updatedAt: 't',
    });
    const pending = createPendingStore();
    const events: MinionEvent[] = [];
    const resolved: unknown[] = [];
    const handled = handleAgentRequest(
      {
        backend,
        pending,
        engine: { resolveRequest: (_id: string, result: unknown) => resolved.push(result) } as never,
        notifier: {
          notify: (event) => events.push(event),
          ask: async () => undefined,
          subscribe: () => () => {},
        },
      },
      'm1',
      {
        requestId: 'req-1',
        payload: {
          method: 'session/request_permission',
          params: {
            toolCall: { title: 'ls' },
            options: [{ optionId: 'allow-once' }, { optionId: 'allow-always' }, { optionId: 'reject' }],
          },
        },
      },
    );
    await until(() => pending.list('m1').length > 0);
    expect(pending.list('m1')[0]).toMatchObject({
      title: 'Permission needed',
      message: 'ls',
      options: [
        { optionId: 'allow-once', label: 'Allow once' },
        { optionId: 'allow-always', label: 'Allow all' },
        { optionId: 'reject', label: 'Reject' },
      ],
    });
    expect(events[0]?.message).toBe('Permission needed: ls Options: Allow once, Allow all, Reject');
    pending.complete('req-1', { outcome: { outcome: 'selected', optionId: 'allow-once' } });
    await handled;
    expect(events[0]?.type).toBe('permission');
    expect(resolved).toEqual([{ outcome: { outcome: 'selected', optionId: 'allow-once' } }]);
  });
});

async function until(check: () => boolean): Promise<void> {
  for (let i = 0; i < 50; i++) {
    if (check()) return;
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error('timed out');
}
