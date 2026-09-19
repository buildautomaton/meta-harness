import { describe, expect, it } from 'vitest';
import { choiceHint } from './choice-option.js';

describe('choiceHint', () => {
  it('labels status_quo as no changes', () => {
    expect(choiceHint({ kind: 'status_quo' })).toBe('No changes');
    expect(choiceHint({ kind: 'change' })).toBeUndefined();
    expect(choiceHint({})).toBeUndefined();
  });
});
