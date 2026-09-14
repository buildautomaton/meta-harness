import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleMcpMethod } from './methods.js';
import type { ToolRegistry } from '../../../types/tools/implementation.js';

const tools: ToolRegistry = {
  listTools: async () => [{ name: 'ping', description: '', inputSchema: {} }],
  callTool: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('handleMcpMethod', () => {
  it('returns initialize result without plugin instructions', async () => {
    const lines: string[] = [];
    const reply = await handleMcpMethod(
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      tools,
      { value: false },
      (line) => lines.push(line),
    );
    expect(lines).toEqual(['[MCP] Initialize complete; server ready']);
    expect(reply?.result).toMatchObject({
      serverInfo: { name: 'meta-harness' },
      capabilities: { tools: {}, logging: {}, prompts: {} },
    });
    expect((reply?.result as { instructions?: string }).instructions).toBeUndefined();
  });

  it('includes instructions from the tools registry', async () => {
    const reply = await handleMcpMethod(
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { ...tools, instructions: () => 'Use spawn_minion instead of Task.' },
      { value: false },
    );
    expect(String((reply?.result as { instructions?: string }).instructions)).toContain(
      'spawn_minion instead',
    );
  });

  it('logs when the client confirms initialized and returns no body', async () => {
    const lines: string[] = [];
    const reply = await handleMcpMethod(
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      tools,
      { value: true },
      (line) => lines.push(line),
    );
    expect(reply).toBeUndefined();
    expect(lines).toEqual(['[MCP] Client initialized; accepting tool calls']);
  });
});
