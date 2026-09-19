import { describe, expect, it } from 'vitest';
import { listenLocalhost, closeServer } from '@buildautomaton/runtime';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import { serveWork } from './serve-work.js';

describe('HTTP clear answer', () => {
  it('deletes queued follow-up work and returns the removed id', async () => {
    const work = createSqliteWorkBackend();
    const artifact = await work.recordSubmission({
      title: 'Checkout',
      description: 'Added checkout',
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep this layout?',
            context: 'Edit checkout.html',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Change' },
            ],
          },
        ],
      },
    });
    const { server, sse } = serveWork(work);
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      await fetch(`http://127.0.0.1:${port}/api/artifacts/${artifact.id}/answers`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([{ subject: '__overview__', questionId: 'q1', choiceId: 'change' }]),
      });
      const cleared = await fetch(`http://127.0.0.1:${port}/api/artifacts/${artifact.id}/answers`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([{ subject: '__overview__', questionId: 'q1', choiceId: '' }]),
      });
      expect(cleared.status).toBe(200);
      const body = (await cleared.json()) as { removed: string[] };
      expect(body.removed).toHaveLength(1);
      const items = (await (await fetch(`http://127.0.0.1:${port}/api/work`)).json()) as { status: string }[];
      expect(items.filter((item) => item.status === 'queued')).toHaveLength(0);
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
