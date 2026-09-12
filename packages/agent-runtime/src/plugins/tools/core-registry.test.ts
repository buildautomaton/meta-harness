import { describe, expect, it } from 'vitest';
import { createCoreToolRegistry } from './core-registry.js';
import { GET_SESSION_TOOL, LAUNCH_SUBAGENT_TOOL } from './names.js';

describe('createCoreToolRegistry', () => {
  it('launches and returns session status', async () => {
    const tools = createCoreToolRegistry({
      launchAgent: async (params) => ({ sessionId: `id-${params.harness}` }),
      getSession: async (sessionId) =>
        sessionId === 'abc'
          ? {
              sessionId,
              status: 'completed',
              harness: 'cursor-cli',
              summary: 'tail',
            }
          : null,
    });
    const names = (await tools.listTools()).map((t) => t.name);
    expect(names).toEqual([LAUNCH_SUBAGENT_TOOL, GET_SESSION_TOOL]);
    const launched = await tools.callTool(LAUNCH_SUBAGENT_TOOL, {
      harness: 'cursor-cli',
      prompt: 'do it',
      model: 'gpt',
    });
    expect(launched.isError).toBeFalsy();
    expect(launched.content[0]?.text).toContain('id-cursor-cli');
    const missing = await tools.callTool(GET_SESSION_TOOL, { sessionId: 'missing' });
    expect(missing.isError).toBe(true);
    const found = await tools.callTool(GET_SESSION_TOOL, { sessionId: 'abc' });
    expect(found.content[0]?.text).toContain('tail');
  });
});
