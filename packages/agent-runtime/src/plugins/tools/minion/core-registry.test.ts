import { describe, expect, it } from 'vitest';
import { createCoreToolRegistry } from './core-registry.js';
import {
  AWAIT_MINION_TOOL,
  GET_MINION_CONTEXT_TOOL,
  GET_MINION_TOOL,
  GET_MINION_TRANSCRIPT_TOOL,
  SPAWN_MINION_TOOL,
} from './names.js';

const done = {
  minionId: 'abc',
  status: 'completed' as const,
  harness: 'cursor-cli',
  pendingRequests: [],
  transcript: 'hello agent',
  summary: 'hello agent',
};

describe('createCoreToolRegistry', () => {
  it('spawns and returns minion status and transcript', async () => {
    const tools = createCoreToolRegistry({
      spawnMinion: async (params) => ({
        ...done,
        minionId: `id-${params.harness}`,
        status: 'running',
        transcript: '',
        summary: '',
      }),
      awaitMinion: async (id) => (id === 'abc' ? done : null),
      getMinion: async (id) => (id === 'abc' ? done : null),
      getMinionContext: () => ({
        workingDirectory: '/work',
        harnesses: [{ type: 'cursor-cli', displayName: 'Cursor' }],
        note: 'shared',
      }),
      resolveMinionRequest: async () => ({ ok: true }),
    });
    const listed = await tools.listTools();
    expect(listed.map((t) => t.name)).toEqual([
      SPAWN_MINION_TOOL,
      AWAIT_MINION_TOOL,
      GET_MINION_CONTEXT_TOOL,
      GET_MINION_TOOL,
      GET_MINION_TRANSCRIPT_TOOL,
      'resolve_minion_request',
    ]);
    const spawnDef = listed.find((t) => t.name === SPAWN_MINION_TOOL);
    const props = (spawnDef?.inputSchema as { properties?: Record<string, unknown> }).properties;
    expect(props).not.toHaveProperty('background');
    const launched = await tools.callTool(SPAWN_MINION_TOOL, {
      harness: 'cursor-cli',
      prompt: 'do it',
    });
    expect(launched.content[0]?.text).toContain('id-cursor-cli');
    const found = await tools.callTool(GET_MINION_TOOL, { minionId: 'abc' });
    expect(found.content[0]?.text).toContain('hello agent');
    const transcript = await tools.callTool(GET_MINION_TRANSCRIPT_TOOL, { minionId: 'abc' });
    expect(transcript.content[0]?.text).toContain('hello agent');
    const missing = await tools.callTool(GET_MINION_TOOL, { minionId: 'missing' });
    expect(missing.isError).toBe(true);
  });
});
