/** Per-turn agent options bag (opaque to the runtime except known keys). */
export type AgentConfig = Record<string, unknown>;

export const AGENT_CONFIG_CLAUDE_PERMISSION_MODE_KEY = 'claude_permission_mode' as const;
export const AGENT_CONFIG_CODEX_PERMISSION_MODE_KEY = 'codex_permission_mode' as const;
export const AGENT_CONFIG_AGENT_MODEL_KEY = 'agent_model' as const;

export function getAgentModelFromAgentConfig(config: AgentConfig | null): string | null {
  if (!config) return null;
  const cur = config[AGENT_CONFIG_AGENT_MODEL_KEY];
  if (typeof cur !== 'string') return null;
  const t = cur.trim();
  return t !== '' ? t : null;
}

export function getClaudePermissionModeFromAgentConfig(config: AgentConfig | null): string | null {
  if (!config) return null;
  const raw = config[AGENT_CONFIG_CLAUDE_PERMISSION_MODE_KEY];
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  return t !== '' ? t : null;
}

export function getCodexPermissionModeFromAgentConfig(config: AgentConfig | null): string | null {
  if (!config) return null;
  const raw = config[AGENT_CONFIG_CODEX_PERMISSION_MODE_KEY];
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  return t !== '' ? t : null;
}
