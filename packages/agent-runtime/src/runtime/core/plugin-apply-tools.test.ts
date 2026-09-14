import { describe, expect, it } from 'vitest';
import { applyPlugins } from './plugin-apply.js';
import { minionToolsPlugin } from '../../plugins/tools/minion/plugin.js';
import type { ToolsPlugin } from '../../types/tools/plugin.js';

const ping: ToolsPlugin = {
  name: 'tools-ping',
  kind: 'tools',
  implementation: {
    listTools: () => [{ name: 'ping', description: 'Health check', inputSchema: { type: 'object' } }],
    callTool: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
  },
};

describe('applyPlugins tools', () => {
  it('registers minion tools as one of several tools plugins', () => {
    const slots = applyPlugins([minionToolsPlugin(), ping], { log: () => {}, cwd: '/tmp' });
    expect(slots.tools).toHaveLength(2);
  });
});
