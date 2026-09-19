import { describe, expect, it } from 'vitest';
import {
  installedAgentAuthProcessEnv,
  cursorAgentUsesApiKeyAuth,
  setInstalledAgentAuthEnv,
} from './installed-agent-auth-env.js';

describe('bridge-installed-agent-auth-env', () => {
  it('merges synced tokens into spawn env', () => {
    setInstalledAgentAuthEnv([{ envVar: 'CURSOR_API_KEY', token: 'key-123' }]);
    const env = installedAgentAuthProcessEnv({ PATH: '/usr/bin' });
    expect(env.CURSOR_API_KEY).toBe('key-123');
    expect(cursorAgentUsesApiKeyAuth(env)).toBe(true);
  });
});
