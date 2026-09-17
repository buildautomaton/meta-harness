import { describe, expect, it } from 'vitest';
import { expandWorkMount, joinHttpPath } from './expand-work.js';

describe('expandWorkMount', () => {
  it('turns a work root into work and artifacts paths', () => {
    const expanded = expandWorkMount({ kind: 'work', path: '/api', plugin: 'work-sqlite' });
    expect(expanded.map((e) => e.path)).toEqual(['/api/work', '/api/artifacts']);
    expect(expanded[1]?.surface).toBe('artifacts');
  });

  it('joins custom route segments', () => {
    expect(joinHttpPath('/v1', 'queue')).toBe('/v1/queue');
    const expanded = expandWorkMount({
      kind: 'work',
      path: '/v1',
      plugin: 'work-sqlite',
      routes: { work: 'queue', artifacts: 'built' },
    });
    expect(expanded.map((e) => e.path)).toEqual(['/v1/queue', '/v1/built']);
  });
});
