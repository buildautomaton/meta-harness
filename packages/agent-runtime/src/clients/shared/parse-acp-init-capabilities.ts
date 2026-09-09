/**
 * Reads ACP `initialize` result agent capabilities (resume / load) for both SDK and Cursor stdio clients.
 */

export function parseAcpInitAgentCapabilities(initResult: Record<string, unknown>): {
  canResume: boolean;
  canLoad: boolean;
  /** Agent accepts image content blocks in `session/prompt` (ACP `promptCapabilities.image`). */
  promptSupportsImage: boolean;
} {
  const agentCapabilities = initResult?.agentCapabilities as Record<string, unknown> | undefined;
  const canLoad = agentCapabilities?.loadSession === true;
  const sessionCaps = agentCapabilities?.sessionCapabilities as Record<string, unknown> | undefined;
  const canResume = Boolean(sessionCaps?.resume);
  const promptCaps = agentCapabilities?.promptCapabilities as Record<string, unknown> | undefined;
  const promptSupportsImage = promptCaps?.image === true;
  return { canResume, canLoad, promptSupportsImage };
}
