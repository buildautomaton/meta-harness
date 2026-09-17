import * as http from 'node:http';
import { describe, expect, it } from 'vitest';
import { handleMcpHttpRequest } from './http-handler.js';
import { listenLocalhost, closeServer } from './http-listen.js';
import { createMcpSseHub } from './sse-hub.js';
import { createSqliteWorkBackend } from '@plugins/work/sqlite/backend.js';

describe('MCP HTTP work mounts', () => {
  it('serves work submitted to a named plugin at the mounted path', async () => {
    const work = createSqliteWorkBackend(':memory:');
    await work.addWork({ title: 'From tools', content: 'Ship it' });
    const sse = createMcpSseHub();
    const server = http.createServer((req, res) => {
      void handleMcpHttpRequest(req, res, {
        path: '/mcp',
        endpoints: [
          { kind: 'tools', path: '/mcp' },
          { kind: 'work', path: '/api/work', work },
        ],
        tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
        initialized: { value: false },
        log: () => {},
        sse,
      });
    });
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
