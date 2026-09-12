import { acquirePromptClient } from './acquire-prompt-client.js';
import { dispatchPrompt } from './dispatch-prompt.js';
import type { PromptRunContext } from './resolve-prompt-run-context.js';
import type { AgentRuntimeContext } from './runtime-context.js';
import type { AgentPromptOptions } from './types.js';

export async function runPrompt(
  ctx: AgentRuntimeContext,
  runCtx: PromptRunContext,
  opts: AgentPromptOptions,
): Promise<void> {
  ctx.promptRouting.setStreamingRunId(runCtx.activeAcpSessionAgentKey, runCtx.activeRunId);
  try {
    const handle = await acquirePromptClient(ctx, runCtx, opts);
    if (handle) await dispatchPrompt(ctx, runCtx, opts, handle);
    else {
      opts.sendResult({
        success: false,
        error:
          ctx.acpAgents.get(runCtx.activeAcpSessionAgentKey)?.lastAcpStartError ??
          'Failed to start agent',
        runId: runCtx.activeRunId,
        sessionId: opts.sessionId,
        promptId: opts.promptId,
      });
    }
  } finally {
    ctx.promptRouting.clearStreamingRunId(runCtx.activeAcpSessionAgentKey, runCtx.activeRunId);
  }
}
