import { describe, expect, it } from 'vitest';
import { coreSet } from './core-set.js';
import type { HttpPlugin } from '@/types/http/plugin.js';

describe('coreSet', () => {
  it('bundles stores, harnesses, disk sessions, minion tools, and HTTP', () => {
    const names = coreSet({ options: { cwd: '/tmp' } }).map((p) => p.name);
    expect(names).toEqual([
      'store-file',
      'store-sql',
      'harness-cursor',
      'harness-codex',
      'harness-kiro',
      'harness-claude-code',
      'harness-opencode',
      'session-disk',
      'tools-minion',
      'transport-http',
    ]);
  });

  it('omits minion tools when disabled', () => {
    const names = coreSet({ options: { cwd: '/tmp', minionTools: false } }).map((p) => p.name);
    expect(names).not.toContain('tools-minion');
  });

  it('mounts MCP tools on the HTTP transport', () => {
    const http = coreSet({ options: { cwd: '/tmp' } }).find((p) => p.name === 'transport-http') as HttpPlugin;
    expect(http.kind).toBe('http');
    expect('endpoints' in http.options ? http.options.endpoints : undefined).toEqual([
      { kind: 'tools', path: '/mcp' },
    ]);
  });

  it('uses stdio transport when requested', () => {
    const names = coreSet({ options: { cwd: '/tmp', transport: 'stdio' } }).map((p) => p.name);
    expect(names).toContain('transport-stdio');
    expect(names).not.toContain('transport-http');
  });
});
