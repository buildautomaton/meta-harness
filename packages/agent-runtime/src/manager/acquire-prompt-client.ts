import { acquireAcpClient } from '../client-lifecycle/acquire-acp-client.js';
import type { AcpClientHandle } from '../types/client.js';
import type { AgentPromptOptions } from '../types/manager.js';
import { getAcpSessionAgentState } from './get-acp-agent-state.js';
import type { PromptRunContext } from './resolve-prompt-run-context.js';
import type { AgentRuntimeContext } from './runtime-context.js';

/** Acquire a live ACP client for this prompt turn (reuse or spawn). */
export async function acquirePromptClient(
  ctx: AgentRuntimeContext,
  runCtx: PromptRunContext,
  opts: AgentPromptOptions,
): Promise<AcpClientHandle | null> {
  const state = getAcpSessionAgentState(ctx, runCtx.activeAcpSessionAgentKey);
  return acquireAcpClient({
    state,
    acpAgentKey: runCtx.activeAcpAgentKey,
    preferredAgentType: runCtx.preferredForPrompt,
    mode: opts.mode,
    agentConfig: opts.agentConfig ?? null,
    cwd: opts.cwd,
    scopeId: opts.scopeId ?? opts.sessionId,
    resolveRouting: () =>
      ctx.promptRouting.resolveRouting(runCtx.activeAcpSessionAgentKey) ??
      (opts.sessionId || opts.runId
        ? { sessionId: opts.sessionId, runId: opts.runId }
        : undefined),
    reportAgentCapabilities: ctx.reportAgentCapabilities,
    sendSessionUpdate: opts.sendSessionUpdate,
    sendRequest: opts.sendRequest ?? ((payload) => opts.sendSessionUpdate(payload)),
    log: ctx.log,
    hostHooks: ctx.clientHostHooks,
  });
}
