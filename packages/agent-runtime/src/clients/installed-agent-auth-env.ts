/** Provider API keys synced from the Bridge DO for managed agent installs. */
const authEnv = new Map<string, string>();

export function setInstalledAgentAuthEnv(
  entries: Array<{ envVar?: string; token?: string }>,
): void {
  authEnv.clear();
  for (const entry of entries) {
    const envVar = typeof entry.envVar === 'string' ? entry.envVar.trim() : '';
    const token = typeof entry.token === 'string' ? entry.token.trim() : '';
    if (envVar && token) authEnv.set(envVar, token);
  }
}

export function installedAgentAuthProcessEnv(
  base: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  if (authEnv.size === 0) return base;
  return { ...base, ...Object.fromEntries(authEnv) };
}

export function cursorAgentUsesApiKeyAuth(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.CURSOR_API_KEY?.trim() || env.CURSOR_AUTH_TOKEN?.trim());
}
