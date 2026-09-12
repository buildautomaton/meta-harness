import { describe, expect, it } from 'vitest';
import { killProcessTreeSync } from './kill-process-tree.js';

describe('killProcessTreeSync', () => {
  it('does not throw for invalid pids', () => {
    expect(() => killProcessTreeSync(0)).not.toThrow();
    expect(() => killProcessTreeSync(-1)).not.toThrow();
    expect(() => killProcessTreeSync(Number.NaN)).not.toThrow();
  });
});
