/**
 * Normalize ACP `session/prompt` outcomes (SDK + Cursor): stop reasons, stderr merge.
 * Assistant text for Cursor also arrives incrementally via `session/update` on the bridge, not here.
 */

import { localAgentErrorSuggestsAuth } from '../../auth/local-agent-auth.js';
import { formatJsonRpcStyleError, mergeErrorWithStderr } from '../agent-stderr-capture.js';
import type { PromptResult } from '../acp-client.js';

export function normalizeAcpPromptTurnSuccess(opts: {
  stopReason?: string | undefined;
  output?: string | undefined;
  stderrCaptureText: string;
  backendAgentType: string | null;
}): PromptResult {
  const { stopReason, output, stderrCaptureText, backendAgentType } = opts;
  const mergedOutput = output || undefined;
  const stop = (stopReason ?? '').toLowerCase();
  const cancelled = stop === 'cancelled';
  const refusal = stop === 'refusal';
  const stderrEvaluated = Boolean(stderrCaptureText && backendAgentType);
  const stderrSuggestsAuth = stderrEvaluated
    ? localAgentErrorSuggestsAuth(backendAgentType!, stderrCaptureText)
    : false;

  if (cancelled) {
    return {
      success: false,
      stopReason,
      output: mergedOutput,
      error: mergeErrorWithStderr('Stopped by user', stderrCaptureText),
    };
  }
  if (refusal) {
    return {
      success: false,
      stopReason,
      output: mergedOutput,
      error: mergeErrorWithStderr('The agent refused the request.', stderrCaptureText),
    };
  }
  if (stderrSuggestsAuth) {
    return {
      success: false,
      stopReason,
      output: mergedOutput,
      error: stderrCaptureText,
    };
  }
  return {
    success: true,
    stopReason,
    output: mergedOutput,
  };
}

export function normalizeAcpPromptTurnFailure(err: unknown, stderrCaptureText: string): PromptResult {
  const merged = mergeErrorWithStderr(formatJsonRpcStyleError(err), stderrCaptureText);
  return { success: false, error: merged };
}
