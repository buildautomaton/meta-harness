import type { AgentPromptOptions } from '../types/manager.js';
import { resolvePromptRunContext } from './resolve-prompt-run-context.js';
import { runPrompt } from './run-prompt.js';
import type { AgentRuntimeContext } from './runtime-context.js';

export function handlePrompt(ctx: AgentRuntimeContext, opts: AgentPromptOptions): void {
  const runCtx = resolvePromptRunContext(ctx, opts);
  if (!runCtx) {
    if (opts.runId) {
      opts.sendResult({
        success: false,
        error:
          'No agent type: send agentType on prompts or call setPreferredAgentType.',
        runId: opts.runId,
        sessionId: opts.sessionId,
        promptId: opts.promptId,
      });
    }
    return;
  }

  void runPrompt(ctx, runCtx, opts).finally(() => {
    ctx.promptRouting.unregisterRun(runCtx.activeRunId);
    ctx.runDispatch.delete(runCtx.activeRunId);
    ctx.pendingCancelRunIds.delete(runCtx.activeRunId);
  });
}
