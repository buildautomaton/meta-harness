import { acquireAcpClient } from '@runtime/acp/lifecycle/acquire-acp-client.js';
import type { AcpClientHandle } from '@runtime/acp/client-types.js';
import type { AgentPromptOptions } from './types.js';
import { getAcpSessionAgentState } from './get-acp-agent-state.js';
import type { PromptRunContext } from './resolve-prompt-run-context.js';
import type { AcpEngineContext } from './engine-context.js';

/** Acquire a live ACP client for this prompt turn (reuse or spawn). */
export async function acquirePromptClient(
  ctx: AcpEngineContext,
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
    reportAgentCapabilities: ctx.reportAgentCapabilities,
    sendSessionUpdate: opts.sendSessionUpdate,
    sendRequest: opts.sendRequest ?? ((payload) => opts.sendSessionUpdate(payload)),
    log: ctx.log,
    hostHooks: ctx.clientHostHooks,
    getHarness: (t) => ctx.harnesses.get(t),
    clientInfo: ctx.clientInfo,
  });
}
