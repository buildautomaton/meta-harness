import { describe, expect, it } from 'vitest';
import { listenLocalhost, closeServer } from '@buildautomaton/runtime';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import { serveWork } from './serve-work.js';

describe('HTTP rename project', () => {
  it('renames work via PATCH /api/work', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Tiles', content: 'Overlay.', project: 'Hiring' });
    const { server, sse } = serveWork(work);
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/work`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ from: 'Hiring', to: 'Studio' }),
      });
      expect(res.status).toBe(204);
      expect((await work.getWork(draft.id))?.project).toBe('Studio');
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
