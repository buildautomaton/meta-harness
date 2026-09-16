import { describe, expect, it } from 'vitest';
import { coreSet } from './core-set.js';

describe('coreSet', () => {
  it('bundles harnesses, disk sessions, minion tools, work, and MCP', () => {
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
      'transport-mcp',
    ]);
  });

  it('omits minion tools and work when disabled', () => {
    const names = coreSet({ options: { cwd: '/tmp', minionTools: false, work: false } }).map((p) => p.name);
    expect(names).not.toContain('tools-minion');
    expect(names).not.toContain('work-sqlite');
    expect(names).not.toContain('work-tools');
  });
});
