import type {
  AgentRuntimeManager,
  AgentRuntimeManagerOptions,
} from '../types/manager.js';
import { setShutdownRequestedCheck } from '../util/shutdown.js';
import { setDefaultLog } from '../util/log.js';
import { discoverAgents } from '../discovery/detect-local-agent-types.js';
import { probeOneAgentTypeForCapabilities } from '../capabilities/probe-one-agent-type-for-capabilities.js';
import {
  getAgentProvider,
  listAgentProviders,
  registerAgentProvider,
} from '../providers/registry.js';
import { cancelRun } from './cancel-run.js';
import { disconnectAll } from './disconnect-all.js';
import { handlePrompt } from './handle-prompt.js';
import { createAgentRuntimeContext } from './runtime-context.js';

/**
 * Create the top-level ACP agent runtime manager for CLI hosts.
 * One ACP subprocess per host scope + agent identity.
 */
export async function createAgentRuntimeManager(
  options: AgentRuntimeManagerOptions,
): Promise<AgentRuntimeManager> {
  setDefaultLog(options.log);
  if (options.isShutdownRequested) {
    setShutdownRequestedCheck(options.isShutdownRequested);
  }

  const ctx = createAgentRuntimeContext({
    log: options.log,
    reportAgentCapabilities: options.reportAgentCapabilities,
    clientHostHooks: options.clientHostHooks,
    isShutdownRequested: options.isShutdownRequested,
  });

  return {
    registerProvider(provider) {
      registerAgentProvider(provider);
    },
    getProvider(agentType) {
      return getAgentProvider(agentType);
    },
    listProviders() {
      return listAgentProviders();
    },
    discoverAgents,
    probeCapabilities(agentType, opts) {
      return probeOneAgentTypeForCapabilities({
        agentType,
        cwd: opts?.cwd,
        signal: opts?.signal,
        log: ctx.log,
        shouldContinue: ctx.isShutdownRequested,
      });
    },
    setPreferredAgentType(agentType: string) {
      if (!ctx.backendFallbackAgentType) {
        ctx.backendFallbackAgentType = agentType;
      }
    },
    prompt: (opts) => handlePrompt(ctx, opts),
    cancelRun: (runId) => cancelRun(ctx, runId),
    isRegisteredRun: (runId) => ctx.promptRouting.isRegisteredRun(runId),
    resolveRequest(requestId: string, result: unknown) {
      for (const state of ctx.acpAgents.values()) {
        state.acpHandle?.resolveRequest?.(requestId, result);
      }
    },
    disconnect: () => disconnectAll(ctx),
  };
}
