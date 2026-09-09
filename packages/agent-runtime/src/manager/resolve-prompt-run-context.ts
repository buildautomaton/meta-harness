import { computeAcpAgentKey, computeAcpSessionAgentKey } from '../keys/acp-agent.js';
import type { AgentPromptOptions } from '../types/manager.js';
import type { AgentRuntimeContext } from './runtime-context.js';

export type PromptRunContext = {
  activeRunId: string;
  activeAcpAgentKey: string;
  activeAcpSessionAgentKey: string;
  preferredForPrompt: string | null;
};

export function resolvePromptRunContext(
  ctx: AgentRuntimeContext,
  opts: Pick<
    AgentPromptOptions,
    'runId' | 'mode' | 'agentType' | 'agentConfig' | 'sessionId' | 'scopeId'
  >,
): PromptRunContext | null {
  const { runId, mode, agentType, agentConfig, sessionId, scopeId } = opts;
  const preferredForPrompt = (agentType ?? ctx.backendFallbackAgentType) ?? null;

  if (!runId) {
    ctx.log('[Agent] Prompt ignored: missing runId (cannot route session updates).');
    return null;
  }

  const acpAgentKey = computeAcpAgentKey(preferredForPrompt, mode, agentConfig ?? null);
  if (!acpAgentKey) return null;

  const activeAcpSessionAgentKey = computeAcpSessionAgentKey(
    scopeId ?? sessionId,
    acpAgentKey,
  );
  ctx.pendingCancelRunIds.delete(runId);
  ctx.promptRouting.registerRun({ sessionId, runId });
  ctx.runDispatch.set(runId, { acpSessionAgentKey: activeAcpSessionAgentKey });

  return {
    activeRunId: runId,
    activeAcpAgentKey: acpAgentKey,
    activeAcpSessionAgentKey,
    preferredForPrompt,
  };
}
