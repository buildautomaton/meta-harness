import { describe, expect, it } from 'vitest';
import { collectProjects, mergeProjects, normalizeProjectName, projectLabel, sameProject } from './project-name.js';

describe('project names', () => {
  it('labels empty as No project and lists named projects', () => {
    expect(projectLabel('')).toBe('No project');
    expect(projectLabel('Hiring')).toBe('Hiring');
    expect(sameProject(undefined, '')).toBe(true);
    expect(normalizeProjectName(' Inbox ')).toBe('');
    expect(normalizeProjectName(' No project ')).toBe('');
    expect(normalizeProjectName('Hiring')).toBe('Hiring');
    expect(
      collectProjects(
        [
          { project: 'Hiring', status: 'draft' } as never,
          { project: '', status: 'draft' } as never,
        ],
        [],
      ),
    ).toEqual(['', 'Hiring']);
    expect(collectProjects([{ project: 'Hiring', status: 'draft' } as never], [])).toEqual([
      'Hiring',
    ]);
    expect(collectProjects([{ project: '', status: 'completed' } as never], [])).toEqual([]);
    expect(collectProjects([], [])).toEqual([]);
    expect(mergeProjects(['', 'Hiring'], ['Studio'])).toEqual(['', 'Hiring', 'Studio']);
  });
});
