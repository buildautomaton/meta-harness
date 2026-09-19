/**
 * Normalize ACP `session/prompt` outcomes (SDK + Cursor): stop reasons, stderr merge.
 * Assistant text for Cursor also arrives incrementally via `session/update` on the bridge, not here.
 */

import { localAgentErrorSuggestsAuth } from '@runtime/harnesses/auth/local-agent-auth.js';
import { formatJsonRpcStyleError, mergeErrorWithStderr } from '@runtime/acp/clients/agent-stderr-capture.js';
import type { PromptResult } from '@runtime/acp/client-types.js';

export function normalizeAcpPromptTurnSuccess(opts: {
  stopReason?: string | undefined;
  output?: string | undefined;
  stderrCaptureText: string;
  authErrorHints?: readonly RegExp[];
}): PromptResult {
  const { stopReason, output, stderrCaptureText, authErrorHints } = opts;
  const mergedOutput = output || undefined;
  const stop = (stopReason ?? '').toLowerCase();
  const cancelled = stop === 'cancelled';
  const refusal = stop === 'refusal';
  const stderrSuggestsAuth = localAgentErrorSuggestsAuth(authErrorHints, stderrCaptureText);

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
