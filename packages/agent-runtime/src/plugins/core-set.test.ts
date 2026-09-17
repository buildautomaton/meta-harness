import { describe, expect, it } from 'vitest';
import { coreSet } from './core-set.js';
import type { TransportPlugin } from '@/types/transport/plugin.js';

describe('coreSet', () => {
  it('bundles harnesses, disk sessions, minion tools, work, and HTTP', () => {
    const names = coreSet({ options: { cwd: '/tmp' } }).map((p) => p.name);
    expect(names).toEqual([
      'harness-cursor',
      'harness-codex',
      'harness-kiro',
      'harness-claude-code',
      'harness-opencode',
      'session-disk',
      'tools-minion',
      'work-sqlite',
      'work-tools',
      'transport-http',
    ]);
  });

  it('omits minion tools and work when disabled', () => {
    const names = coreSet({ options: { cwd: '/tmp', minionTools: false, work: false } }).map((p) => p.name);
    expect(names).not.toContain('tools-minion');
    expect(names).not.toContain('work-sqlite');
    expect(names).not.toContain('work-tools');
  });

  it('mounts sqlite work on the HTTP transport from a root path', () => {
    const http = coreSet({ options: { cwd: '/tmp' } }).find((p) => p.name === 'transport-http') as TransportPlugin;
    expect('endpoints' in http.options ? http.options.endpoints : undefined).toEqual([
      { kind: 'tools', path: '/mcp' },
      { kind: 'work', path: '/api', plugin: 'work-sqlite' },
    ]);
  });

  it('uses stdio transport when requested', () => {
    const names = coreSet({ options: { cwd: '/tmp', transport: 'stdio' } }).map((p) => p.name);
    expect(names).toContain('transport-stdio');
    expect(names).not.toContain('transport-http');
  });
});
