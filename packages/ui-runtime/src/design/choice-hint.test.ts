import { describe, expect, it } from 'vitest';
import { choiceHint, choiceHints } from './choice-option.js';

describe('choiceHints', () => {
  it('labels status_quo as no changes', () => {
    expect(choiceHint({ kind: 'status_quo' })).toBe('No changes');
    expect(choiceHint({ kind: 'change' })).toBeUndefined();
    expect(choiceHint({})).toBeUndefined();
  });

  it('shows Recommended only when it is not also status_quo', () => {
    expect(choiceHints({ recommended: true })).toEqual(['Recommended']);
    expect(choiceHints({ recommended: true, kind: 'change' })).toEqual(['Recommended']);
    expect(choiceHints({ recommended: true, kind: 'status_quo' })).toEqual(['No changes']);
  });
});
