import type {
  AcpEngine,
  AcpEngineOptions,
} from './types.js';
import { setShutdownRequestedCheck } from '@runtime/core/util/shutdown.js';
import { setDefaultLog } from '@runtime/core/util/log.js';
import { discoverAgents } from '@runtime/harnesses/discovery/detect-local-agent-types.js';
import { probeOneAgentTypeForCapabilities } from '@runtime/acp/capabilities/probe-one-agent-type-for-capabilities.js';
import { cancelRun } from './cancel-run.js';
import { disconnectAll } from './disconnect-all.js';
import { handlePrompt } from './prompt-pipeline.js';
import { createAcpEngineContext } from './engine-context.js';

/**
 * Create the ACP engine. Harnesses start empty; register them (or apply a
 * harness plugin) before prompting. Prefer `createRuntime` for CLI hosts.
 */
export async function createAcpEngine(
  options: AcpEngineOptions,
): Promise<AcpEngine> {
  setDefaultLog(options.log);
  if (options.isShutdownRequested) {
    setShutdownRequestedCheck(options.isShutdownRequested);
  }

  const ctx = createAcpEngineContext({
    log: options.log,
    reportAgentCapabilities: options.reportAgentCapabilities,
    clientHostHooks: options.clientHostHooks,
    isShutdownRequested: options.isShutdownRequested,
    clientInfo: options.clientInfo,
  });

  return {
    registerHarness(harness) {
      ctx.harnesses.register(harness);
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
