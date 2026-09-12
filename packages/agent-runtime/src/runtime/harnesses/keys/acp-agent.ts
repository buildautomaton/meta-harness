import {
  resolveAgentCommand,
  type GetAgentHarnessFn,
} from './resolve-agent-command.js';

/** Stable key identifying one shared AcpAgent subprocess (agent type + spawn argv + config). */
export type AcpAgentKey = string;

/**
 * Stable key for one ACP subprocess: optional host scope + agent spawn identity.
 * When `scopeId` is missing, falls back to `::${acpAgentKey}`.
 */
export type AcpSessionAgentKey = string;

/** Compute the map key for per-scope ACP client state and prompt routing. */
export function computeAcpSessionAgentKey(
  scopeId: string | undefined | null,
  acpAgentKey: AcpAgentKey,
): AcpSessionAgentKey {
  const sid = scopeId?.trim();
  if (!sid) return `::${acpAgentKey}`;
  return `${sid}::${acpAgentKey}`;
}

/** Compute the key that identifies the AcpAgent for a prompt's agent type, mode, and config. */
export function computeAcpAgentKey(
  preferredAgentType: string | null,
  mode?: string,
  agentConfig?: Record<string, unknown> | null,
  getHarness?: GetAgentHarnessFn,
): AcpAgentKey | null {
  const resolved = resolveAgentCommand(preferredAgentType, getHarness);
  if (!resolved) return null;
  const fullCmd = resolved.spawnCommandForSession(mode, agentConfig ?? null);
  const cacheConfig =
    agentConfig != null &&
    typeof agentConfig === 'object' &&
    !Array.isArray(agentConfig) &&
    Object.keys(agentConfig).length > 0
      ? `\0${JSON.stringify(agentConfig, Object.keys(agentConfig).sort())}`
      : '';
  return `${resolved.label}::${fullCmd.join('\0')}${cacheConfig}`;
}
