import * as http from 'node:http';
import { describe, expect, it } from 'vitest';
import { handleHttpRequest } from './http-handler.js';
import { listenLocalhost, closeServer } from './http-listen.js';
import { createMcpSseHub } from './sse-hub.js';
import { expandWorkMount } from './expand-work.js';
import { createSqliteWorkBackend } from '@plugins/work/sqlite/backend.js';

function serve(work: ReturnType<typeof createSqliteWorkBackend>) {
  const endpoints = [
    { kind: 'tools' as const, path: '/mcp' },
    ...expandWorkMount({ kind: 'work', path: '/api', plugin: 'work-sqlite' }).map((e) => ({ ...e, work })),
  ];
  const sse = createMcpSseHub();
  const server = http.createServer((req, res) => {
    void handleHttpRequest(req, res, {
      path: '/mcp',
      endpoints,
      tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
      initialized: { value: false },
      log: () => {},
      sse,
    });
  });
  return { server, sse };
}

describe('HTTP clear answer', () => {
  it('deletes queued follow-up work and returns the removed id', async () => {
    const work = createSqliteWorkBackend(':memory:');
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
    const { server, sse } = serve(work);
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
