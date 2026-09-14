import { describe, expect, it } from 'vitest';
import { coreSet } from './core-set.js';

describe('coreSet', () => {
  it('bundles harnesses, disk sessions, minion tools, and MCP', () => {
    const names = coreSet({ options: { cwd: '/tmp' } }).map((p) => p.name);
    expect(names).toEqual([
      'harness-cursor',
      'harness-codex',
      'harness-kiro',
      'harness-claude-code',
      'harness-opencode',
      'session-disk',
      'tools-minion',
      'transport-mcp',
    ]);
  });

  it('omits minion tools when disabled', () => {
    const names = coreSet({ options: { cwd: '/tmp', minionTools: false } }).map((p) => p.name);
    expect(names).not.toContain('tools-minion');
  });
});
