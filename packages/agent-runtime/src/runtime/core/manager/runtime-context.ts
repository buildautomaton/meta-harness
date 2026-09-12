import type { LogFn } from '../../../types/log.js';
import type { ClientHostHooks } from './types.js';
import type { ReportAgentCapabilitiesFn } from '../../harnesses/capability-types.js';
import type { AcpSessionAgentKey } from '../../harnesses/keys/acp-agent.js';
import { AcpPromptRoutingRegistry } from '../../harnesses/keys/acp-prompt-routing-registry.js';
import type { AcpClientState } from '../../harnesses/client-lifecycle/acp-client-state.js';
import {
  createHarnessRegistry,
  type RuntimeHarnessRegistry,
} from '../../harnesses/create-registry.js';

export type RunDispatchMeta = {
  acpSessionAgentKey: AcpSessionAgentKey;
};

export type AgentRuntimeContext = {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  harnesses: RuntimeHarnessRegistry;
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
    harnesses: createHarnessRegistry(),
    backendFallbackAgentType: null,
    acpAgents: new Map(),
    promptRouting: new AcpPromptRoutingRegistry(),
    runDispatch: new Map(),
    pendingCancelRunIds: new Set(),
  };
}
