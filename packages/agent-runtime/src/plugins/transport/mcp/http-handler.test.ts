import * as http from 'node:http';
import { describe, expect, it } from 'vitest';
import { handleMcpHttpRequest } from './http-handler.js';
import { listenLocalhost, closeServer } from './http-listen.js';
import { createMcpSseHub } from './sse-hub.js';

describe('handleMcpHttpRequest', () => {
  it('returns 404 off path, 406 without SSE accept, and opens SSE on GET', async () => {
    const sse = createMcpSseHub();
    const server = http.createServer((req, res) => {
      void handleMcpHttpRequest(req, res, {
        path: '/mcp',
        tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
        initialized: { value: false },
        log: () => {},
        sse,
      });
    });
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      const miss = await fetch(`http://127.0.0.1:${port}/nope`);
      expect(miss.status).toBe(404);
      const get = await fetch(`http://127.0.0.1:${port}/mcp`);
      expect(get.status).toBe(406);
      const ac = new AbortController();
      const sseRes = await fetch(`http://127.0.0.1:${port}/mcp`, {
        headers: { accept: 'text/event-stream' },
        signal: ac.signal,
      });
      expect(sseRes.status).toBe(200);
      expect(sseRes.headers.get('content-type')).toContain('text/event-stream');
      ac.abort();
    } finally {
      sse.close();
      await closeServer(server);
    }
  });

  it('writes minion logging notifications onto the SSE stream', async () => {
    const sse = createMcpSseHub();
    const server = http.createServer((req, res) => {
      void handleMcpHttpRequest(req, res, {
        path: '/mcp',
        tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
        initialized: { value: true },
        log: () => {},
        sse,
      });
    });
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      const ac = new AbortController();
      const sseRes = await fetch(`http://127.0.0.1:${port}/mcp`, {
        headers: { accept: 'text/event-stream' },
        signal: ac.signal,
      });
      sse.broadcast({
        jsonrpc: '2.0',
        method: 'notifications/message',
        params: { level: 'info', logger: 'minion', data: { minionId: 'm1', type: 'progress' } },
      });
      const reader = sseRes.body?.getReader();
      let text = '';
      while (reader && !text.includes('notifications/message')) {
        const { value, done } = await reader.read();
        if (done) break;
        text += new TextDecoder().decode(value);
      }
      expect(text).toContain('notifications/message');
      ac.abort();
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
