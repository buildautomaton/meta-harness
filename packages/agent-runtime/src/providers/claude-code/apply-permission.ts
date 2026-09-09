import type { AgentConfig } from '../../util/agent-config.js';
import { getClaudePermissionModeFromAgentConfig } from '../../util/agent-config.js';
import type {
  SessionConfigOption,
  SessionConfigSelectGroup,
  SessionConfigSelectOption,
  SessionConfigSelectOptions,
  SessionModeState,
} from '@agentclientprotocol/sdk';

function flattenSelectOptions(options: SessionConfigSelectOptions | null | undefined): SessionConfigSelectOption[] {
  if (options == null || options.length === 0) return [];
  const first = options[0] as SessionConfigSelectOption | SessionConfigSelectGroup;
  if (first != null && typeof first === 'object' && 'group' in first && first.group != null) {
    return (options as SessionConfigSelectGroup[]).flatMap((g) =>
      Array.isArray(g.options) ? g.options : [],
    );
  }
  return options as SessionConfigSelectOption[];
}

function pickModeConfigOption(
  configOptions: SessionConfigOption[] | null | undefined,
): SessionConfigOption | null {
  if (configOptions == null || configOptions.length === 0) return null;
  const byCategory = configOptions.find((o) => o.category === 'mode');
  if (byCategory) return byCategory;
  return configOptions.find((o) => o.id === 'mode') ?? null;
}

type SetModeFn = (p: { sessionId: string; modeId: string }) => Promise<unknown>;
type SetConfigFn = (p: { sessionId: string; configId: string; value: string }) => Promise<unknown>;

/**
 * Applies Claude permission mode from agent_config using ACP config options when present,
 * otherwise {@link setSessionMode} with legacy `modes` from the session response.
 */
export async function applyClaudePermissionFromAcpSession(params: {
  sessionId: string;
  agentConfig: AgentConfig | null;
  configOptions: SessionConfigOption[] | null | undefined;
  modes: SessionModeState | null | undefined;
  setSessionConfigOption: SetConfigFn;
  setSessionMode: SetModeFn;
  logDebug: (line: string) => void;
}): Promise<void> {
  const { sessionId, agentConfig, configOptions, modes, setSessionConfigOption, setSessionMode, logDebug } = params;
  const desiredMode = getClaudePermissionModeFromAgentConfig(agentConfig);
  if (desiredMode == null) return;

  const modeOpt = pickModeConfigOption(configOptions ?? null);
  if (modeOpt != null) {
    const flat = flattenSelectOptions(modeOpt.options);
    const allowed = flat.some((o) => o.value === desiredMode);
    if (allowed && modeOpt.currentValue !== desiredMode) {
      try {
        logDebug(
          `[Agent] Claude Code: sending ACP session/set_config_option (permission mode) configId=${JSON.stringify(modeOpt.id)} value=${JSON.stringify(desiredMode)} was=${JSON.stringify(modeOpt.currentValue)} sessionId=${sessionId.slice(0, 8)}…`,
        );
        await setSessionConfigOption({ sessionId, configId: modeOpt.id, value: desiredMode });
      } catch (e) {
        logDebug(
          `[Agent] Claude Code: session/set_config_option failed: ${e instanceof Error ? e.message : String(e)}`,
        );
      }
    }
    return;
  }

  if (modes?.availableModes?.length) {
    const allowed = modes.availableModes.some((m) => m.id === desiredMode);
    if (allowed && desiredMode !== modes.currentModeId) {
      try {
        logDebug(
          `[Agent] Claude Code: sending ACP session/set_mode (permission mode) modeId=${JSON.stringify(desiredMode)} was=${JSON.stringify(modes.currentModeId ?? null)} sessionId=${sessionId.slice(0, 8)}…`,
        );
        await setSessionMode({ sessionId, modeId: desiredMode });
      } catch (e) {
        logDebug(`[Agent] Claude Code: session/set_mode failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
}
