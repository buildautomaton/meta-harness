import type { AcpClientOptions } from '@runtime/acp/client-types.js';
import type { ClientHostHooks } from '@runtime/acp/engine/types.js';
import type { ReportAgentCapabilitiesFn } from '@runtime/acp/capability-types.js';
import type { LogFn } from '@/types/log.js';
import type { ResolvedAgentCommand } from '@runtime/acp/keys/resolve-agent-command.js';
import type { GetAgentHarnessFn } from '@runtime/harnesses/types.js';
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
  getHarness: GetAgentHarnessFn;
  clientInfo?: { name: string; version: string };
};

export function spawnCreateClientOptions(
  params: SpawnAcpClientParams,
  state: AcpClientState,
  persistedAcpSessionId: string | null,
): AcpClientOptions {
  return {
    command: params.resolved.command,
    sessionMode: params.mode,
    agentConfig: params.agentConfig ?? null,
    backendAgentType: params.preferredAgentType,
    persistedAcpSessionId,
    getActiveConfigOptions: () => state.activeSessionConfigOptions,
    ...acpPersistCallbacks({
      state,
      hostHooks: params.hostHooks,
      scopeId: params.scopeId,
      preferredAgentType: params.preferredAgentType,
      persistedAcpSessionId,
      reportAgentCapabilities: params.reportAgentCapabilities,
    }),
    ...acpSessionHooks({
      hostHooks: params.hostHooks,
      sendSessionUpdate: params.sendSessionUpdate,
      sendRequest: params.sendRequest,
    }),
    cwd: params.targetCwd,
    scopeId: params.scopeId ?? null,
    mcpServers: params.mcpServers,
    authErrorHints: params.getHarness(params.preferredAgentType)?.authErrorHints,
    clientInfo: params.clientInfo,
  };
}
