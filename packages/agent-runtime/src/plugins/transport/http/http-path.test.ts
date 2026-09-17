import { describe, expect, it } from 'vitest';
import { MCP_DEFAULT_PATH, normalizeHttpPath } from './http-path.js';

describe('normalizeHttpPath', () => {
  it('defaults, adds a leading slash, and strips trailing slashes', () => {
    expect(normalizeHttpPath('')).toBe(MCP_DEFAULT_PATH);
    expect(normalizeHttpPath('mcp')).toBe('/mcp');
    expect(normalizeHttpPath('/tools/')).toBe('/tools');
  });
});
