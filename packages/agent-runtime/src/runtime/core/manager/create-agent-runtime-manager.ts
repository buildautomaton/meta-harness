import type {
  AgentRuntimeManager,
  AgentRuntimeManagerOptions,
} from './types.js';
import { setShutdownRequestedCheck } from '../util/shutdown.js';
import { setDefaultLog } from '../util/log.js';
import { discoverAgents } from '../../harnesses/discovery/detect-local-agent-types.js';
import { probeOneAgentTypeForCapabilities } from '../../harnesses/capabilities/probe-one-agent-type-for-capabilities.js';
import { cancelRun } from './cancel-run.js';
import { disconnectAll } from './disconnect-all.js';
import { handlePrompt } from './handle-prompt.js';
import { createAgentRuntimeContext } from './runtime-context.js';
import { registerAgentHarness } from '../../harnesses/registry.js';

/**
 * Create the top-level ACP agent runtime manager for CLI hosts.
 * Harnesses start empty; register them (or apply a harness plugin) before prompting.
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
    registerHarness(harness) {
      ctx.harnesses.register(harness);
      registerAgentHarness(harness);
    },
    getHarness(agentType) {
      return ctx.harnesses.get(agentType);
    },
    listHarnesses() {
      return ctx.harnesses.list();
    },
    discoverAgents: () => discoverAgents(ctx.harnesses.listAutoDetect()),
    probeCapabilities(agentType, opts) {
      return probeOneAgentTypeForCapabilities({
        agentType,
        cwd: opts?.cwd,
        signal: opts?.signal,
        log: ctx.log,
        shouldContinue: ctx.isShutdownRequested,
        getHarness: (t) => ctx.harnesses.get(t),
      });
    },
    setPreferredHarnessType(agentType: string) {
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
