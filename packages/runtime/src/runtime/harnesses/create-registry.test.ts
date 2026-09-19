import { describe, expect, it } from 'vitest';
import { createHarnessRegistry } from './create-registry.js';
import type { AgentHarness } from './types.js';

function stub(type: string, detect = false): AgentHarness {
  return {
    type,
    displayName: type,
    defaultCommand: ['x'],
    authErrorHints: [],
    detectPresence: detect ? async () => true : undefined,
    buildSpawnCommand: (base) => [...base],
  };
}

describe('createHarnessRegistry', () => {
  it('registers, replaces same type, and lists auto-detect', () => {
    const registry = createHarnessRegistry([stub('a', true)]);
    expect(registry.get('a')?.displayName).toBe('a');
    registry.register(stub('a'));
    expect(registry.list()).toHaveLength(1);
    registry.register(stub('b', true));
    expect(registry.listAutoDetect().map((p) => p.type)).toEqual(['b']);
  });
});
