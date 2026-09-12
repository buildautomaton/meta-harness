import type { AcpClientHandle } from '../../harnesses/client-types.js';
import type { AgentPromptOptions } from './types.js';
import type { PromptRunContext } from './resolve-prompt-run-context.js';
import type { AgentRuntimeContext } from './runtime-context.js';

export async function dispatchPrompt(
  ctx: AgentRuntimeContext,
  runCtx: PromptRunContext,
  opts: AgentPromptOptions,
  handle: AcpClientHandle,
): Promise<void> {
  const { promptText, promptId, sessionId, images, sendResult } = opts;
  const { activeRunId } = runCtx;

  if (ctx.pendingCancelRunIds.has(activeRunId)) {
    ctx.pendingCancelRunIds.delete(activeRunId);
    sendResult({
      success: false,
      error: 'Cancelled before start',
      runId: activeRunId,
      sessionId,
      promptId,
    });
    return;
  }

  try {
    const result = await handle.sendPrompt(promptText, images?.length ? { images } : undefined);
    ctx.harnesses.notifyPromptTurnFinished(sessionId);
    sendResult({
      success: result.success,
      stopReason: result.stopReason,
      output: result.output,
      error: result.error,
      runId: activeRunId,
      sessionId,
      promptId,
    });
  } catch (err) {
    ctx.harnesses.notifyPromptTurnFinished(sessionId);
    sendResult({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      runId: activeRunId,
      sessionId,
      promptId,
    });
  }
}
