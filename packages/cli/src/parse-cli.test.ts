import { describe, expect, it } from 'vitest';
import { parseCli } from './parse-cli.js';

describe('parseCli', () => {
  it('defaults to disk MCP in cwd', () => {
    const parsed = parseCli(['node', 'meta-harness', '--cwd', '/work']);
    expect(parsed).toMatchObject({
      cwd: '/work',
      backend: 'disk',
      transport: 'mcp',
      verbose: false,
    });
  });

  it('parses remote transport flags', () => {
    const parsed = parseCli([
      'node',
      'meta-harness',
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
