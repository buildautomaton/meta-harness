import { describe, expect, it } from 'vitest';
import { formatStderrForTerminal } from './format-stderr-for-terminal.js';

describe('formatStderrForTerminal', () => {
  it('suppresses Codex models_manager refresh dumps', () => {
    const out = formatStderrForTerminal(
      'ERROR codex_core::models_manager::manager: failed to refresh available models: unknown variant `max`; body: {"models":[]}',
    );
    expect(out).toBe('');
  });

  it('suppresses deprecated zed package npm warnings', () => {
    expect(
      formatStderrForTerminal('npm warn deprecated @zed-industries/codex-acp@0.16.0: migrate'),
    ).toBe('');
  });

  it('omits huge ; body: JSON payloads when not otherwise suppressed', () => {
    const prefix = 'ERROR other_crate: something failed';
    const out = formatStderrForTerminal(`${prefix}; body: ${'{"models":[' + 'x'.repeat(50_000)}`);
    expect(out).toContain('something failed');
    expect(out).toContain('; body: [omitted]');
    expect(out).not.toContain('{"models":');
  });

  it('drops JSON continuation chunks', () => {
    expect(formatStderrForTerminal(`{"slug":"${'x'.repeat(500)}"`)).toBe('');
  });

  it('passes short auth messages through unchanged', () => {
    expect(formatStderrForTerminal('login required')).toBe('login required');
  });

  it('suppresses git non-repo fatals', () => {
    expect(
      formatStderrForTerminal('fatal: not a git repository (or any of the parent directories): .git'),
    ).toBe('');
  });
});
