import { describe, expect, it } from 'vitest';
import { elicitationParams } from './elicitation.js';

describe('elicitationParams', () => {
  it('uses the same notice text for permission and auth', () => {
    const permission = elicitationParams({
      minionId: 'm1',
      requestId: 'r1',
      kind: 'permission',
      method: 'session/request_permission',
      title: 'Permission needed',
      message: 'ls',
      options: [
        { optionId: 'allow-once', label: 'Allow once' },
        { optionId: 'allow-always', label: 'Allow all' },
      ],
    });
    const auth = elicitationParams({
      minionId: 'm1',
      requestId: 'auth:m1',
      kind: 'auth',
      method: 'auth',
      title: 'Authentication needed',
      message: 'cursor-cli needs a provider login or API token',
      options: [{ optionId: 'token', label: 'Provide API token' }],
    });
    expect(permission.message).toBe('Permission needed: ls Options: Allow once, Allow all');
    expect(auth.message).toBe(
      'Authentication needed: cursor-cli needs a provider login or API token Options: Provide API token',
    );
  });
});
