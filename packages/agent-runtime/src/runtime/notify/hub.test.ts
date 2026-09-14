import { describe, expect, it } from 'vitest';
import { createNotifierHub } from './hub.js';

describe('createNotifierHub', () => {
  it('fans out notify and returns the first ask result', async () => {
    const hub = createNotifierHub();
    const seen: string[] = [];
    hub.subscribe({
      notify: (event) => seen.push(event.message),
      ask: async () => undefined,
    });
    hub.subscribe({
      notify: (event) => seen.push(`${event.type}`),
      ask: async () => ({ optionId: 'allow-once' }),
    });
    hub.notify({ minionId: 'm', type: 'progress', message: 'hi' });
    expect(seen).toEqual(['hi', 'progress']);
    await expect(
      hub.ask({
        minionId: 'm',
        requestId: 'r',
        kind: 'permission',
        method: 'session/request_permission',
        title: 'Permission needed',
        message: 'run',
      }),
    ).resolves.toEqual({ optionId: 'allow-once' });
  });
});
