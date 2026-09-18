import { describe, expect, it } from 'vitest';
import { joinHttpPath } from '@buildautomaton/agent-runtime';
import { expandWorkMount } from './expand-work.js';

describe('expandWorkMount', () => {
  it('turns a work root into work and artifacts paths', () => {
    const expanded = expandWorkMount({ path: '/api', plugin: 'work-sqlite' });
    expect(expanded.map((e) => e.path)).toEqual(['/api/work', '/api/artifacts', '/api/assets', '/api/work/events']);
    expect(expanded[1]?.surface).toBe('artifacts');
    expect(expanded[2]?.surface).toBe('assets');
    expect(expanded[3]?.surface).toBe('events');
  });

  it('joins custom route segments', () => {
    expect(joinHttpPath('/v1', 'queue')).toBe('/v1/queue');
    const expanded = expandWorkMount({
      path: '/v1',
      plugin: 'work-sqlite',
      routes: { work: 'queue', artifacts: 'built' },
    });
    expect(expanded.map((e) => e.path)).toEqual(['/v1/queue', '/v1/built', '/v1/assets', '/v1/queue/events']);
  });
});
