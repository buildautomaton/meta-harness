import type { LogFn } from '../types/log.js';
import type { ReportAgentCapabilitiesFn, ClientHostHooks } from '../types/index.js';
import type { AcpSessionAgentKey } from '../keys/acp-agent.js';
import { AcpPromptRoutingRegistry } from '../keys/acp-prompt-routing-registry.js';
import type { AcpClientState } from '../client-lifecycle/acp-client-state.js';

export type RunDispatchMeta = {
  acpSessionAgentKey: AcpSessionAgentKey;
};

export type AgentRuntimeContext = {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  backendFallbackAgentType: string | null;
  acpAgents: Map<AcpSessionAgentKey, AcpClientState>;
  promptRouting: AcpPromptRoutingRegistry;
  runDispatch: Map<string, RunDispatchMeta>;
  pendingCancelRunIds: Set<string>;
};

export function createAgentRuntimeContext(options: {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
}): AgentRuntimeContext {
  return {
    log: options.log,
    reportAgentCapabilities: options.reportAgentCapabilities,
    clientHostHooks: options.clientHostHooks,
    isShutdownRequested: options.isShutdownRequested,
    backendFallbackAgentType: null,
    acpAgents: new Map(),
    promptRouting: new AcpPromptRoutingRegistry(),
    runDispatch: new Map(),
    pendingCancelRunIds: new Set(),
  };
}
