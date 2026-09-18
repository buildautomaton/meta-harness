import { describe, expect, it } from 'vitest';
import { listenLocalhost, closeServer } from '@buildautomaton/agent-runtime';
import { createSqliteWorkBackend } from '@plugins/work/sqlite/backend.js';
import { serveWork } from './serve-work.js';

describe('HTTP answer queues work', () => {
  it('creates queued work from a review answer and lists it on GET /api/work', async () => {
    const work = createSqliteWorkBackend();
    const artifact = await work.recordSubmission({
      title: 'Checkout',
      description: 'Added checkout',
      ui: { pages: [{ filename: 'checkout.html', title: 'Checkout', html: '<html></html>' }] },
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep this layout?',
            context: 'Change checkout.html if they want a different layout.',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Use a two-column layout' },
            ],
          },
        ],
      },
    });
    const { server, sse } = serveWork(work);
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      const posted = await fetch(`http://127.0.0.1:${port}/api/artifacts/${artifact.id}/answers`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([{ subject: '__overview__', questionId: 'q1', choiceId: 'change' }]),
      });
      expect(posted.status).toBe(200);
      const queued = (await posted.json()) as { queued: { status: string; prompt: string }[] };
      expect(queued.queued).toHaveLength(1);
      expect(queued.queued[0]?.status).toBe('queued');
      expect(queued.queued[0]?.prompt).toBe('Keep this layout?');
      const listed = await fetch(`http://127.0.0.1:${port}/api/work`);
      const items = (await listed.json()) as { status: string; prompt: string; decisions: string[] }[];
      const found = items.filter((item) => item.status === 'queued');
      expect(found).toHaveLength(1);
      expect(found[0]?.decisions).toEqual(['Use a two-column layout']);
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
