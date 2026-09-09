import { describe, expect, it } from 'vitest';
import {
  CODEX_ACP_PACKAGE,
  LEGACY_CODEX_ACP_PACKAGE,
  buildCodexAcpSpawnCommand,
  isCodexAcpCommand,
  normalizeCodexAcpCommand,
} from './client.js';

describe('buildCodexAcpSpawnCommand', () => {
  const base = ['npx', '--yes', CODEX_ACP_PACKAGE];

  it('does not add permission flags without a selected mode', () => {
    expect(buildCodexAcpSpawnCommand(base, 'agent', null)).toEqual(base);
  });

  it('does not add permission flags for selected modes', () => {
    expect(
      buildCodexAcpSpawnCommand(base, 'agent', {
        codex_permission_mode: 'read_only',
      }),
    ).toEqual(base);
  });

  it('rewrites the deprecated Zed package to the maintained ACP package', () => {
    expect(
      buildCodexAcpSpawnCommand(['npx', '--yes', LEGACY_CODEX_ACP_PACKAGE], 'agent', null),
    ).toEqual(['npx', '--yes', CODEX_ACP_PACKAGE]);
  });
});

describe('isCodexAcpCommand / normalizeCodexAcpCommand', () => {
  it('recognizes both package names', () => {
    expect(isCodexAcpCommand(['npx', '--yes', CODEX_ACP_PACKAGE])).toBe(true);
    expect(isCodexAcpCommand(['npx', '--yes', LEGACY_CODEX_ACP_PACKAGE])).toBe(true);
  });

  it('normalizes legacy package only', () => {
    expect(normalizeCodexAcpCommand(['npx', LEGACY_CODEX_ACP_PACKAGE])).toEqual([
      'npx',
      CODEX_ACP_PACKAGE,
    ]);
    expect(normalizeCodexAcpCommand(['npx', CODEX_ACP_PACKAGE])).toEqual(['npx', CODEX_ACP_PACKAGE]);
  });
});
