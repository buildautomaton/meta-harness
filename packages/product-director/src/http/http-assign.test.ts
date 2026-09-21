import { describe, expect, it } from 'vitest';
import { listenLocalhost, closeServer } from '@buildautomaton/runtime';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import { serveWork } from './serve-work.js';

describe('HTTP assign project', () => {
  it('patches work and artifact projects', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Tiles', content: 'Overlay.' });
    const artifact = await work.recordSubmission({ title: 'Tiles', description: 'Overlay' });
    const { server, sse } = serveWork(work);
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    const base = `http://127.0.0.1:${port}`;
    try {
      const item = await fetch(`${base}/api/work/${draft.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ project: 'Studio' }),
      });
      expect(item.status).toBe(200);
      expect((await work.getWork(draft.id))?.project).toBe('Studio');
      const saved = await fetch(`${base}/api/artifacts/${artifact.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ project: 'Hiring' }),
      });
      expect(saved.status).toBe(200);
      expect((await work.getArtifact(artifact.id))?.project).toBe('Hiring');
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
