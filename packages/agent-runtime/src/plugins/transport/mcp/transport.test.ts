import { describe, expect, it } from 'vitest';
import { createMcpTransport } from './transport.js';
import { MCP_SERVER_NAME } from './methods.js';

describe('createMcpTransport', () => {
  it('serves JSON-RPC on localhost HTTP and logs listening', async () => {
    const lines: string[] = [];
    let url = '';
    const transport = createMcpTransport({
      port: 0,
      path: '/mcp',
      log: (line) => lines.push(line),
      onListening: (info) => {
        url = info.url;
      },
    });
    const started = transport.start({
      cwd: '/work',
      listTools: async () => [{ name: 'spawn_minion', description: '', inputSchema: {} }],
      callTool: async () => ({ content: [] }),
    });
    await viWaitFor(() => Boolean(url));
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }),
    });
    const body = (await res.json()) as { result?: { serverInfo?: { name?: string } } };
    expect(body.result?.serverInfo?.name).toBe(MCP_SERVER_NAME);
    await transport.stop();
    await started;
    expect(lines[0]).toBe('[MCP] Starting HTTP JSON-RPC server');
    expect(lines[1]).toMatch(/^\[MCP] Listening on http:\/\/127\.0\.0\.1:\d+\/mcp \(spawn_minion\)$/);
    expect(lines).toContain('[MCP] HTTP server closed');
  });
});

async function viWaitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('timed out waiting for MCP listen');
    await new Promise((r) => setTimeout(r, 10));
  }
}
