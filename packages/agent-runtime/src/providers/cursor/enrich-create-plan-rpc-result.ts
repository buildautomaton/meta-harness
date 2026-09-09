import { writeCreatePlanFile } from './write-create-plan-file.js';

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function resolveAcceptedPlanMarkdown(
  outcome: Record<string, unknown>,
  pendingParams: Record<string, unknown>,
): string {
  if (typeof outcome.plan === 'string' && outcome.plan.trim()) return outcome.plan;
  if (typeof pendingParams.plan === 'string') return pendingParams.plan;
  return '';
}

/**
 * Map UI create_plan responses to the documented ACP shape.
 * On accept, write plan markdown under `agent-runtime plans dir/<sessionId>/` and return `planUri`
 * so Cursor can continue the turn after approval.
 */
export function enrichCreatePlanRpcResult(
  result: unknown,
  pendingParams: Record<string, unknown>,
  acpSessionId: string | undefined,
): unknown {
  const root = asRecord(result);
  const outcome = asRecord(root?.outcome);
  if (!outcome) return result;

  const kind = typeof outcome.outcome === 'string' ? outcome.outcome : '';
  if (kind !== 'accepted') {
    const { plan: _drop, ...rest } = outcome;
    return { ...root, outcome: rest };
  }

  const planMarkdown = resolveAcceptedPlanMarkdown(outcome, pendingParams);
  const toolCallIdRaw = pendingParams.toolCallId ?? pendingParams.tool_call_id;
  const toolCallId = typeof toolCallIdRaw === 'string' ? toolCallIdRaw.trim() : '';
  const sessionId = acpSessionId?.trim() ?? '';

  if (planMarkdown && toolCallId && sessionId) {
    const planUri = writeCreatePlanFile({ acpSessionId: sessionId, toolCallId, planMarkdown });
    return { outcome: { outcome: 'accepted', planUri } };
  }

  return { outcome: { outcome: 'accepted' } };
}
