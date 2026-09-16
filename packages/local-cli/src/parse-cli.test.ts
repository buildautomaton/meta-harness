import { describe, expect, it } from 'vitest';
import { parseCli } from './parse-cli.js';
import { MCP_DEFAULT_PATH, MCP_DEFAULT_PORT } from '@buildautomaton/agent-runtime';

describe('parseCli', () => {
  it('defaults to disk MCP HTTP in cwd', () => {
    const parsed = parseCli(['node', 'local-cli', '--cwd', '/work']);
    expect(parsed).toMatchObject({
      cwd: '/work',
      backend: 'disk',
      transport: 'mcp',
      mcpPort: MCP_DEFAULT_PORT,
      mcpPath: MCP_DEFAULT_PATH,
      verbose: false,
    });
  });

  it('parses MCP HTTP port and path', () => {
    const parsed = parseCli([
      'node',
      'local-cli',
      '--port',
      '4010',
      '--mcp-path',
      '/tools',
    ]);
    expect(parsed.mcpPort).toBe(4010);
    expect(parsed.mcpPath).toBe('/tools');
  });

  it('normalizes MCP path without a leading slash', () => {
    const parsed = parseCli(['node', 'local-cli', '--mcp-path', 'mcp']);
    expect(parsed.mcpPath).toBe('/mcp');
  });

  it('parses remote transport flags', () => {
    const parsed = parseCli([
      'node',
      'local-cli',
      '--transport',
      'remote',
      '--remote-url',
      'https://example.test',
      '--backend',
      'stream',
      '--verbose',
    ]);
    expect(parsed.transport).toBe('remote');
    expect(parsed.remoteUrl).toBe('https://example.test');
    expect(parsed.backend).toBe('stream');
    expect(parsed.verbose).toBe(true);
  });
});
