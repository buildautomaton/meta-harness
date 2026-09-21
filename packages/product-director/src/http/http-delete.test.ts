import { describe, expect, it } from 'vitest';
import { listenLocalhost, closeServer } from '@buildautomaton/runtime';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import { DRAFT_ONLY } from '@/types/work/draft-only.js';
import { serveWork } from './serve-work.js';

describe('HTTP delete draft', () => {
  it('deletes any draft and rejects queued work', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.' });
    await work.attachSession(draft.id, 'interview-1');
    const { server, sse } = serveWork(work);
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      const removed = await fetch(`http://127.0.0.1:${port}/api/work/${draft.id}`, { method: 'DELETE' });
      expect(removed.status).toBe(204);
      expect(await work.getWork(draft.id)).toBeNull();

      const missing = await fetch(`http://127.0.0.1:${port}/api/work/${draft.id}`, { method: 'DELETE' });
      expect(missing.status).toBe(404);

      const queued = await work.addWork({ title: 'Queued', queued: true });
      const blocked = await fetch(`http://127.0.0.1:${port}/api/work/${queued.id}`, { method: 'DELETE' });
      expect(blocked.status).toBe(409);
      expect(((await blocked.json()) as { error: string }).error).toBe(DRAFT_ONLY);
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
