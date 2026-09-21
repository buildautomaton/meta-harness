import { describe, expect, it } from 'vitest';
import { matchProjects, resolveProjectPick } from './match-projects.js';

describe('matchProjects', () => {
  it('filters named projects and offers create for a new name', () => {
    expect(matchProjects(['', 'Hiring', 'Studio'], '')).toEqual([{ name: 'Hiring' }, { name: 'Studio' }]);
    expect(matchProjects(['Hiring', 'Studio'], 'hi')).toEqual([
      { name: 'Hiring' },
      { name: 'hi', create: true },
    ]);
    expect(matchProjects(['Hiring'], 'Hiring')).toEqual([{ name: 'Hiring' }]);
    expect(resolveProjectPick(['Hiring', 'Studio'], 'hi')).toBe('hi');
    expect(resolveProjectPick(['Hiring'], 'hiring')).toBe('Hiring');
  });
});
