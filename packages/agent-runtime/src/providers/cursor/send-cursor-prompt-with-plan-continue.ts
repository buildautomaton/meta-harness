import { log } from '../../util/log.js';
import type { PromptResult } from '../../clients/acp-client.js';
import type { AcpSessionContext } from '../../clients/acp-session-context.js';
import type { AcpImagePromptPart, AcpSessionTransport } from '../../clients/acp-session-transport.js';
import { sendAcpPromptViaTransport } from '../../clients/shared/send-acp-prompt-via-transport.js';
import {
  consumePendingPlanExecute,
  CURSOR_PLAN_CONTINUE_PROMPT,
  switchCursorSessionToAgentMode,
} from './cursor-plan-continue.js';

/** Run the user prompt, then implement an accepted create_plan in the same ACP turn. */
export async function sendCursorPromptWithPlanContinue(params: {
  transport: AcpSessionTransport;
  sessionCtx: AcpSessionContext;
  sessionId: string;
  prompt: string;
  images?: AcpImagePromptPart[];
}): Promise<PromptResult> {
  const { transport, sessionCtx, sessionId, prompt, images } = params;
  const first = await sendAcpPromptViaTransport(transport, sessionCtx, sessionId, prompt, images);
  if (!first.success || !consumePendingPlanExecute(sessionCtx.pendingPlanExecute)) return first;
  log('[Agent] Plan accepted; continuing to implement.');
  await switchCursorSessionToAgentMode(transport, sessionId);
  return sendAcpPromptViaTransport(
    transport,
    sessionCtx,
    sessionId,
    CURSOR_PLAN_CONTINUE_PROMPT,
  );
}
