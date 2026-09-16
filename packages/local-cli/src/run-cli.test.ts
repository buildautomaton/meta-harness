import { describe, expect, it, vi } from 'vitest';
import { formatCliStartup } from './run-cli.js';
import { createLog, writeInfo } from './log.js';
import { CLI_VERSION } from './version.js';

describe('formatCliStartup', () => {
  it('includes transport, cwd, and backend', () => {
    expect(
      formatCliStartup({
        cwd: '/work',
        backend: 'disk',
        transport: 'mcp',
        mcpPort: 3333,
        mcpPath: '/mcp',
        verbose: false,
      }),
    ).toBe(
      `[CLI] Starting local-cli ${CLI_VERSION} transport=mcp cwd=/work backend=disk url=http://127.0.0.1:3333/mcp`,
    );
  });

  it('includes remoteUrl when set', () => {
    expect(
      formatCliStartup({
        cwd: '/work',
        backend: 'stream',
        transport: 'remote',
        remoteUrl: 'https://example.test',
        mcpPort: 3333,
        mcpPath: '/mcp',
        verbose: true,
      }),
    ).toContain('remoteUrl=https://example.test');
  });
});

describe('createLog', () => {
  it('writes verbose lines and always-on info to stderr', () => {
    const writes: string[] = [];
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
      writes.push(String(chunk));
      return true;
    });
    createLog(false)('hidden');
    createLog(true)('shown');
    writeInfo('always');
    spy.mockRestore();
    expect(writes).toEqual(['shown\n', 'always\n']);
  });
});
