import { describe, expect, it } from 'vitest';
import { collapseAfterSelect, visibleChoices } from './choice-collapse.js';

describe('visibleChoices', () => {
  const choices = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('shows every choice when nothing is selected', () => {
    expect(visibleChoices(choices, '', false).map((c) => c.id)).toEqual(['a', 'b', 'c']);
  });

  it('keeps only the selected choice when collapsed', () => {
    expect(visibleChoices(choices, 'b', false).map((c) => c.id)).toEqual(['b']);
  });

  it('shows every choice when expanded', () => {
    expect(visibleChoices(choices, 'b', true).map((c) => c.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('collapseAfterSelect', () => {
  it('stays open until a choice is selected', () => {
    expect(collapseAfterSelect('').open).toBe(true);
    expect(collapseAfterSelect('a').open).toBe(false);
  });
});
