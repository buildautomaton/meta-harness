import type { LogFn } from '@/types/log.js';
import type { ClientHostHooks } from './types.js';
import type { ReportAgentCapabilitiesFn } from '@runtime/acp/capability-types.js';
import type { AcpSessionAgentKey } from '@runtime/acp/keys/acp-agent.js';
import { AcpPromptRoutingRegistry } from '@runtime/acp/keys/acp-prompt-routing-registry.js';
import type { AcpClientState } from '@runtime/acp/lifecycle/acp-client-state.js';
import {
  createHarnessRegistry,
  type RuntimeHarnessRegistry,
} from '@runtime/harnesses/create-registry.js';

export type RunDispatchMeta = {
  acpSessionAgentKey: AcpSessionAgentKey;
};

export type AcpEngineContext = {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  clientInfo?: { name: string; version: string };
  harnesses: RuntimeHarnessRegistry;
  backendFallbackAgentType: string | null;
  acpAgents: Map<AcpSessionAgentKey, AcpClientState>;
  promptRouting: AcpPromptRoutingRegistry;
  runDispatch: Map<string, RunDispatchMeta>;
  pendingCancelRunIds: Set<string>;
};

export function createAcpEngineContext(options: {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  clientInfo?: { name: string; version: string };
}): AcpEngineContext {
  return {
    log: options.log,
    reportAgentCapabilities: options.reportAgentCapabilities,
    clientHostHooks: options.clientHostHooks,
    isShutdownRequested: options.isShutdownRequested,
    clientInfo: options.clientInfo,
    harnesses: createHarnessRegistry(),
    backendFallbackAgentType: null,
    acpAgents: new Map(),
    promptRouting: new AcpPromptRoutingRegistry(),
    runDispatch: new Map(),
    pendingCancelRunIds: new Set(),
  };
}
