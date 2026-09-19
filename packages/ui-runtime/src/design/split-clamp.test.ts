import { describe, expect, it } from 'vitest';
import { clampSplit } from './split-clamp.js';

describe('clampSplit', () => {
  const bounds = { minLeft: 240, maxLeft: 2400, minRight: 240, container: 800 };

  it('keeps the left pane within min and remaining right space', () => {
    expect(clampSplit(100, bounds)).toBe(240);
    expect(clampSplit(900, bounds)).toBe(560);
    expect(clampSplit(400, bounds)).toBe(400);
  });
});
