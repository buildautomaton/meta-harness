import { describe, expect, it } from 'vitest';
import { createRemoteTransport } from './transport.js';
import type { RemoteCommand, RemoteTransportImplementation } from '../../../types/transport/options.js';

describe('createRemoteTransport', () => {
  it('registers tools then dispatches call_tool commands', async () => {
    let handler: ((cmd: RemoteCommand) => Promise<unknown>) | undefined;
    const adapter: RemoteTransportImplementation = {
      async register(info) {
        expect(info.cwd).toBe('/work');
        expect(info.tools[0]?.name).toBe('ping');
      },
      async subscribe(next) {
        handler = next;
      },
      unsubscribe() {},
    };
    const lines: string[] = [];
    const transport = createRemoteTransport(adapter, (line) => lines.push(line));
    let called = '';
    await transport.start({
      cwd: '/work',
      listTools: () => [{ name: 'ping', description: '', inputSchema: {} }],
      callTool: async (name) => {
        called = name;
        return { content: [{ type: 'text', text: 'ok' }] };
      },
    });
    const result = await handler?.({ id: '1', type: 'call_tool', name: 'ping', params: {} });
    expect(called).toBe('ping');
    expect(result).toEqual({ content: [{ type: 'text', text: 'ok' }] });
    expect(lines).toEqual([
      '[Remote] Registering with control plane',
      '[Remote] Registered (ping)',
      '[Remote] Subscribed; ready for commands',
    ]);
    await transport.stop();
    expect(lines.at(-1)).toBe('[Remote] Stopping');
  });
});
