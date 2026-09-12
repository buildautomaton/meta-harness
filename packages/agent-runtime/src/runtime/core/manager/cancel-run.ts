import type { AgentRuntimeContext } from './runtime-context.js';

export async function cancelRun(ctx: AgentRuntimeContext, runId: string): Promise<boolean> {
  const meta = ctx.runDispatch.get(runId);
  if (!meta) return false;
  const streamingRunId = ctx.promptRouting.getStreamingRunId(meta.acpSessionAgentKey);
  if (streamingRunId && streamingRunId !== runId) return false;

  const handle = ctx.acpAgents.get(meta.acpSessionAgentKey)?.acpHandle;
  if (handle?.cancel) {
    ctx.log('[Agent] Stop requested');
    try {
      await handle.cancel();
      return true;
    } catch (err) {
      ctx.log(`[Agent] Cancel failed: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }
  ctx.log('[Agent] Stop requested (agent still starting)');
  ctx.pendingCancelRunIds.add(runId);
  return true;
}
