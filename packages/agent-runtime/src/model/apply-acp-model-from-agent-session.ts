import type { AgentConfig } from '../util/agent-config.js';
import { getAgentModelFromAgentConfig } from '../util/agent-config.js';
import type {
  SessionConfigOption,
  SessionConfigSelectGroup,
  SessionConfigSelectOption,
  SessionConfigSelectOptions,
} from '@agentclientprotocol/sdk';

function flattenSelectOptions(options: SessionConfigSelectOptions | null | undefined): SessionConfigSelectOption[] {
  if (options == null || options.length === 0) return [];
  const first = options[0] as SessionConfigSelectOption | SessionConfigSelectGroup;
  if (first != null && typeof first === 'object' && 'group' in first && first.group != null) {
    return (options as SessionConfigSelectGroup[]).flatMap((g) => (Array.isArray(g.options) ? g.options : []));
  }
  return options as SessionConfigSelectOption[];
}

function looksLikeModelOption(o: SessionConfigOption): boolean {
  if (o.category === 'model' || o.category === 'models') return true;
  const id = typeof o.id === 'string' ? o.id.toLowerCase() : '';
  if (id === 'model' || id.endsWith('_model') || id.includes('model')) return true;
  const name = typeof o.name === 'string' ? o.name.toLowerCase() : '';
  return name.includes('model') && !name.includes('mode');
}

function pickModelConfigOption(
  configOptions: SessionConfigOption[] | null | undefined,
): SessionConfigOption | null {
  if (configOptions == null || configOptions.length === 0) return null;
  return configOptions.find(looksLikeModelOption) ?? null;
}

type SetConfigFn = (p: { sessionId: string; configId: string; value: string }) => Promise<unknown>;

/**
 * Applies agent model selection from `agent_config.agent_model` (legacy: `acp_model_value`) via `session/set_config_option`
 * when the agent exposes a model config option.
 */
export async function applyAcpModelFromAcpSession(params: {
  sessionId: string;
  agentConfig: AgentConfig | null;
  configOptions: SessionConfigOption[] | null | undefined;
  setSessionConfigOption: SetConfigFn;
  logDebug: (line: string) => void;
}): Promise<void> {
  const { sessionId, agentConfig, configOptions, setSessionConfigOption, logDebug } = params;
  const desired = getAgentModelFromAgentConfig(agentConfig);
  if (desired == null) return;

  const modelOpt = pickModelConfigOption(configOptions ?? null);
  if (modelOpt == null) return;

  const flat = flattenSelectOptions(modelOpt.options);
  const allowed = flat.some((o) => o.value === desired);
  if (!allowed) return;

  if (modelOpt.currentValue === desired) return;

  try {
    logDebug(
      `[Agent] ACP session/set_config_option (model) configId=${JSON.stringify(modelOpt.id)} value=${JSON.stringify(desired)} was=${JSON.stringify(modelOpt.currentValue)} sessionId=${sessionId.slice(0, 8)}…`,
    );
    await setSessionConfigOption({ sessionId, configId: modelOpt.id, value: desired });
  } catch (e) {
    logDebug(
      `[Agent] ACP session/set_config_option (model) failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}
