import { describe, expect, it } from 'vitest';
import { matchEndpoint } from './match-endpoint.js';

describe('matchEndpoint', () => {
  it('picks the longest matching path prefix', () => {
    const endpoints = [
      { path: '/api', kind: 'work' },
      { path: '/api/work', kind: 'work' },
      { path: '/mcp', kind: 'tools' },
    ];
    expect(matchEndpoint(endpoints, '/api/work/abc')?.path).toBe('/api/work');
    expect(matchEndpoint(endpoints, '/mcp')?.kind).toBe('tools');
    expect(matchEndpoint(endpoints, '/nope')).toBeUndefined();
  });
});
