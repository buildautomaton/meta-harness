import { describe, expect, it } from 'vitest';
import { MCP_DEFAULT_PATH, joinHttpPath, normalizeHttpPath } from './http-path.js';

describe('normalizeHttpPath', () => {
  it('defaults, adds a leading slash, and strips trailing slashes', () => {
    expect(normalizeHttpPath('')).toBe(MCP_DEFAULT_PATH);
    expect(normalizeHttpPath('mcp')).toBe('/mcp');
    expect(normalizeHttpPath('/tools/')).toBe('/tools');
  });
});

describe('joinHttpPath', () => {
  it('joins a root and segment', () => {
    expect(joinHttpPath('/api', 'work')).toBe('/api/work');
    expect(joinHttpPath('/', 'sessions')).toBe('/sessions');
  });
});

describe('normalizeHttpPath', () => {
  it('defaults, adds a leading slash, and strips trailing slashes', () => {
    expect(normalizeHttpPath('')).toBe(MCP_DEFAULT_PATH);
    expect(normalizeHttpPath('mcp')).toBe('/mcp');
    expect(normalizeHttpPath('/tools/')).toBe('/tools');
  });
});
