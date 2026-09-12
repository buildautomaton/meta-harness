/** Persist ACP session ids / config onto host hooks and local client state. */

import type { AcpClientOptions } from '../client-types.js';
import type { ClientHostHooks } from '../../core/manager/types.js';
import type { ReportAgentCapabilitiesFn } from '../capability-types.js';
import type { AcpClientState } from './acp-client-state.js';

export function acpPersistCallbacks(params: {
  state: AcpClientState;
  hostHooks?: ClientHostHooks;
  scopeId?: string;
  preferredAgentType: string | null;
  persistedAcpSessionId: string | null;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
}): Pick<
  AcpClientOptions,
  | 'onAcpSessionEstablished'
  | 'onAcpConfigOptionsUpdated'
  | 'onAcpAvailableCommandsUpdated'
  | 'onAgentSubprocessExit'
> {
  const {
    state,
    hostHooks,
    scopeId,
    preferredAgentType,
    persistedAcpSessionId,
    reportAgentCapabilities,
  } = params;
  return {
    onAcpSessionEstablished: (info) => {
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
    onAcpConfigOptionsUpdated: (configOptions) => {
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
    onAcpAvailableCommandsUpdated: (availableCommands) => {
      state.activeAvailableCommands = availableCommands;
      if (scopeId) hostHooks?.persistAvailableCommands?.({ scopeId, availableCommands });
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
  };
}
