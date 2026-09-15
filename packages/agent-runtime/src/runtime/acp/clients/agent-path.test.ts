import { describe, expect, it } from 'vitest';
import { augmentPath, getAgentPathEntries } from './agent-path.js';

describe('bridge-agent-path', () => {
  it('prepends common install dirs without duplicates', () => {
    const home = '/home/tester';
    const extra = getAgentPathEntries(home);
    expect(extra).toContain('/home/tester/.local/bin');
    const merged = augmentPath('/usr/bin', extra);
    expect(merged.startsWith('/home/tester/.local/bin:')).toBe(true);
    expect(merged).toContain('/usr/bin');
    expect(augmentPath(merged, extra).split(':').filter((p) => p === '/home/tester/.local/bin')).toHaveLength(1);
  });
});
