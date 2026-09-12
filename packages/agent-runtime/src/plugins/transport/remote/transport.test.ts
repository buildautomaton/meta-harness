import { describe, expect, it } from 'vitest';
import { createRemoteTransport } from './transport.js';
import type { RemoteCommand, RemoteTransportImplementation } from '../../../types/transport/options.js';
import { LAUNCH_SUBAGENT_TOOL } from '../../tools/names.js';

describe('createRemoteTransport', () => {
  it('registers tools then dispatches call_tool commands', async () => {
    let handler: ((cmd: RemoteCommand) => Promise<unknown>) | undefined;
    const adapter: RemoteTransportImplementation = {
      async register(info) {
        expect(info.cwd).toBe('/work');
        expect(info.tools[0]?.name).toBe(LAUNCH_SUBAGENT_TOOL);
      },
      async subscribe(next) {
        handler = next;
      },
      unsubscribe() {},
    };
    const transport = createRemoteTransport(adapter);
    let called = '';
    await transport.start({
      cwd: '/work',
      listTools: () => [{ name: LAUNCH_SUBAGENT_TOOL, description: '', inputSchema: {} }],
      callTool: async (name) => {
        called = name;
        return { content: [{ type: 'text', text: 'ok' }] };
      },
    });
    const result = await handler?.({ id: '1', type: 'call_tool', name: LAUNCH_SUBAGENT_TOOL, params: {} });
    expect(called).toBe(LAUNCH_SUBAGENT_TOOL);
    expect(result).toEqual({ content: [{ type: 'text', text: 'ok' }] });
    await transport.stop();
  });
});
