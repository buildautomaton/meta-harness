/** Spawn a new ACP subprocess and wire host persistence / session callbacks. */

import type { AcpClientHandle } from '../types/client.js';
import type { ClientHostHooks, ReportAgentCapabilitiesFn } from '../types/index.js';
import type { LogFn } from '../types/log.js';
import type { ResolvedAgentCommand } from '../keys/resolve-agent-command.js';
import { errorMessage } from '../util/error-message.js';
import { isShutdownRequested } from '../util/shutdown.js';
import type { AcpClientState } from './acp-client-state.js';
import { mapRequestKind } from './map-request-kind.js';

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
  resolveRouting: () => { sessionId?: string; runId?: string } | undefined;
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
    resolveRouting,
    sendSessionUpdate,
    sendRequest,
    reportAgentCapabilities,
    log,
    hostHooks,
  } = params;

  const sessionCallbacks =
    hostHooks?.buildSessionCallbacks?.({
      resolveRouting,
      sendSessionUpdate,
      sendRequest,
      getAgentConfig: () => state.latestAgentConfig,
      log,
    }) ?? {
      onSessionUpdate: (p) => sendSessionUpdate(p),
      onRequest: (request) =>
        sendRequest({
          type: 'session_update',
          requestId: request.requestId,
          kind: mapRequestKind(request.method),
          payload: {
            sessionUpdate: mapRequestKind(request.method),
            requestId: request.requestId,
            method: request.method,
            params: request.params,
          },
        }),
    };

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
      onAcpSessionEstablished: (info: {
        acpSessionId: string;
        configOptions: unknown[] | null;
        modes: unknown;
      }) => {
        state.activeSessionConfigOptions = info.configOptions ?? state.activeSessionConfigOptions;
        if (scopeId && preferredAgentType) {
          hostHooks?.writePersistedSession?.({
            scopeId,
            acpSessionId: info.acpSessionId,
            configOptions: info.configOptions,
            modes: info.modes,
          });
        }
        if (reportAgentCapabilities && preferredAgentType && Array.isArray(info.configOptions)) {
          reportAgentCapabilities({ agentType: preferredAgentType, configOptions: info.configOptions });
        }
      },
      onAcpConfigOptionsUpdated: (configOptions: unknown[]) => {
        state.activeSessionConfigOptions = configOptions;
        if (scopeId && preferredAgentType) {
          hostHooks?.writePersistedSession?.({
            scopeId,
            acpSessionId: persistedAcpSessionId ?? '',
            configOptions,
            modes: null,
          });
        }
        if (reportAgentCapabilities && preferredAgentType) {
          reportAgentCapabilities({ agentType: preferredAgentType, configOptions });
        }
      },
      onAcpAvailableCommandsUpdated: (availableCommands: unknown[]) => {
        state.activeAvailableCommands = availableCommands;
        if (scopeId) {
          hostHooks?.persistAvailableCommands?.({ scopeId, availableCommands });
        }
        if (reportAgentCapabilities && preferredAgentType) {
          reportAgentCapabilities({ agentType: preferredAgentType, availableCommands });
        }
      },
      onAgentSubprocessExit: () => {
        if (state.acpHandle != null) state.clientEpoch += 1;
        state.acpHandle = null;
        state.acpStartPromise = null;
        state.acpAgentKey = null;
        state.activeSessionConfigOptions = null;
        state.activeAvailableCommands = null;
        state.latestAgentConfig = null;
        state.lastAcpStartError = 'Agent subprocess exited';
      },
      ...sessionCallbacks,
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
