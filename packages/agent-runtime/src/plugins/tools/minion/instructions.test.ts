import { describe, expect, it } from 'vitest';
import { MINION_INSTRUCTIONS, MINION_PROMPT } from './instructions.js';
import { SPAWN_MINION_DEFINITION } from './spawn-minion-def.js';
import { RESOLVE_MINION_DEFINITION } from './resolve-minion-def.js';

describe('MCP minion docs', () => {
  it('forbids background spawn and tells the coordinator to resolve in-flight', () => {
    expect(MINION_INSTRUCTIONS).toMatch(/never pass background/i);
    expect(MINION_INSTRUCTIONS).toMatch(/while spawn_minion is still running/i);
    expect(MINION_INSTRUCTIONS).toMatch(/current permission mode/i);
    expect(MINION_PROMPT.description).toMatch(/never pass background/i);
    expect(SPAWN_MINION_DEFINITION.description).toMatch(/no background/i);
    expect(SPAWN_MINION_DEFINITION.inputSchema).toMatchObject({ additionalProperties: false });
    expect(SPAWN_MINION_DEFINITION.inputSchema.properties).not.toHaveProperty('background');
    expect(RESOLVE_MINION_DEFINITION.description).toMatch(/still in flight/i);
  });
});
