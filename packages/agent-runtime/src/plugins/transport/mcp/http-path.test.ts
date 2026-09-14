import { describe, expect, it } from 'vitest';
import { MCP_DEFAULT_PATH, normalizeMcpPath } from './http-path.js';

describe('normalizeMcpPath', () => {
  it('defaults, adds a leading slash, and strips trailing slashes', () => {
    expect(normalizeMcpPath('')).toBe(MCP_DEFAULT_PATH);
    expect(normalizeMcpPath('mcp')).toBe('/mcp');
    expect(normalizeMcpPath('/tools/')).toBe('/tools');
  });
});
