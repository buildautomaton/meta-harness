import type { AcpClientHandle } from '../client-types.js';
import type { ClientHostHooks } from '../../core/manager/types.js';
import type { ReportAgentCapabilitiesFn } from '../capability-types.js';
import type { LogFn } from '../../../types/log.js';
import type { ResolvedAgentCommand } from '../keys/resolve-agent-command.js';
import { errorMessage } from '../../core/util/error-message.js';
import { isShutdownRequested } from '../../core/util/shutdown.js';
import type { AcpClientState } from './acp-client-state.js';
import { acpPersistCallbacks } from './acp-persist-callbacks.js';
import { acpSessionHooks } from './acp-session-hooks.js';

export type SpawnAcpClientParams = {
  state: AcpClientState;
  resolved: ResolvedAgentCommand;
  preferredAgentType: string | null;
  mode?: string;
  agentConfig?: Record<string, unknown> | null;
  targetCwd: string;
  acpAgentKey: string;
  scopeId?: string;
  mcpServers: unknown[];
  sendSessionUpdate: (payload: unknown) => void;
  sendRequest: (payload: unknown) => void;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  log: LogFn;
  hostHooks?: ClientHostHooks;
};

export function spawnAcpClient(params: SpawnAcpClientParams): Promise<AcpClientHandle | null> {
  const {
    state,
    resolved,
    preferredAgentType,
    mode,
    agentConfig,
    targetCwd,
    acpAgentKey,
    scopeId,
    mcpServers,
    sendSessionUpdate,
    sendRequest,
    reportAgentCapabilities,
    log,
    hostHooks,
  } = params;

  const persisted =
    scopeId && preferredAgentType ? hostHooks?.readPersistedSession?.(scopeId) ?? null : null;
  const persistedAcpSessionId = persisted?.acpSessionId?.trim() || null;
  state.activeSessionConfigOptions = Array.isArray(persisted?.configOptions)
    ? persisted!.configOptions
    : null;
  const spawnEpoch = state.clientEpoch;
  return resolved
    .createClient({
      command: resolved.command,
      sessionMode: mode,
      agentConfig: agentConfig ?? null,
      backendAgentType: preferredAgentType,
      persistedAcpSessionId,
      getActiveConfigOptions: () => state.activeSessionConfigOptions,
      ...acpPersistCallbacks({
        state,
        hostHooks,
        scopeId,
        preferredAgentType,
        persistedAcpSessionId,
        reportAgentCapabilities,
      }),
      ...acpSessionHooks({ hostHooks, sendSessionUpdate, sendRequest }),
      cwd: targetCwd,
      scopeId: scopeId ?? null,
      mcpServers,
    })
    .then(async (h) => {
      if (spawnEpoch !== state.clientEpoch || isShutdownRequested()) {
        try {
          await h.disconnectGracefully();
        } catch {
          /* ignore */
        }
        state.acpStartPromise = null;
        return null;
      }
      state.lastAcpStartError = null;
      state.acpHandle = h;
      state.lastAcpCwd = targetCwd;
      state.acpAgentKey = acpAgentKey;
      return h;
    })
    .catch((err) => {
      state.lastAcpStartError = errorMessage(err);
      log(`[Agent] Failed to start: ${state.lastAcpStartError}`);
      state.acpStartPromise = null;
      state.acpAgentKey = null;
      return null;
    });
}
