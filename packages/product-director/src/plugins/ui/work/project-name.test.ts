import { describe, expect, it } from 'vitest';
import { collectProjects, mergeProjects, normalizeProjectName, projectLabel, sameProject } from './project-name.js';

describe('project names', () => {
  it('labels empty as Inbox and lists named projects', () => {
    expect(projectLabel('')).toBe('Inbox');
    expect(projectLabel('Hiring')).toBe('Hiring');
    expect(sameProject(undefined, '')).toBe(true);
    expect(normalizeProjectName(' Inbox ')).toBe('');
    expect(normalizeProjectName('Hiring')).toBe('Hiring');
    expect(collectProjects([{ project: 'Hiring' } as never, { project: '' } as never], [])).toEqual([
      '',
      'Hiring',
    ]);
    expect(mergeProjects(['', 'Hiring'], ['Studio'])).toEqual(['', 'Hiring', 'Studio']);
  });
});
