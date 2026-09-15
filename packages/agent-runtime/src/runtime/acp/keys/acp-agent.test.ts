import { describe, expect, it } from 'vitest';
import { computeAcpSessionAgentKey } from './acp-agent.js';

describe('computeAcpSessionAgentKey', () => {
  it('scopes subprocess keys per cloud session', () => {
    expect(computeAcpSessionAgentKey('session-a', 'cursor-cli::argv')).toBe(
      'session-a::cursor-cli::argv',
    );
    expect(computeAcpSessionAgentKey('session-b', 'cursor-cli::argv')).toBe(
      'session-b::cursor-cli::argv',
    );
    expect(computeAcpSessionAgentKey('session-a', 'cursor-cli::argv')).not.toBe(
      computeAcpSessionAgentKey('session-b', 'cursor-cli::argv'),
    );
  });

  it('falls back to legacy shared key when cloud session id is missing', () => {
    expect(computeAcpSessionAgentKey(undefined, 'cursor-cli::argv')).toBe('::cursor-cli::argv');
    expect(computeAcpSessionAgentKey('', 'cursor-cli::argv')).toBe('::cursor-cli::argv');
  });
});
