import { describe, expect, it } from 'vitest';
import { getMcpPrompt, listMcpPrompts } from './prompts.js';

const prompts = [
  {
    name: 'coordinate-with-minions',
    title: 'Coordinate with minions',
    description: 'Use spawn_minion instead of Task.',
    text: 'NEVER use Task. Call spawn_minion.',
  },
];

describe('MCP prompts', () => {
  it('lists prompts supplied by tools plugins', () => {
    expect(listMcpPrompts(1, prompts).result).toMatchObject({
      prompts: [{ name: 'coordinate-with-minions' }],
    });
    expect(listMcpPrompts(1, []).result).toMatchObject({ prompts: [] });
  });

  it('returns prompt text from the tools plugin', () => {
    const got = getMcpPrompt(2, { name: 'coordinate-with-minions' }, prompts);
    const result = got.result as { messages: Array<{ content: { text: string } }> };
    expect(result.messages[0]?.content.text).toContain('NEVER use Task');
  });
});
