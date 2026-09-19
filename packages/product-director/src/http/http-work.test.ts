import { describe, expect, it } from 'vitest';
import { listenLocalhost, closeServer } from '@buildautomaton/runtime';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import { serveWork } from './serve-work.js';

describe('HTTP work mounts', () => {
  it('serves work submitted to a named plugin at the mounted path', async () => {
    const work = createSqliteWorkBackend();
    await work.addWork({ title: 'From tools', content: 'Ship it' });
    const { server, sse } = serveWork(work);
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/work`);
      expect(res.status).toBe(200);
      const items = (await res.json()) as { title: string }[];
      expect(items[0]?.title).toBe('From tools');
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
