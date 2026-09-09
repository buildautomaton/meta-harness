import type { AcpSessionTransport } from '../../clients/acp-session-transport.js';

/** Follow-up ACP prompt after `cursor/create_plan` accept — Cursor ends the planning turn otherwise. */
export const CURSOR_PLAN_CONTINUE_PROMPT =
  'The user accepted the plan. Implement it now. Do not wait for another approval unless the plan needs material changes.';

export type PendingPlanExecuteRef = { value: boolean };

export function isAcceptedCreatePlanRpcResult(result: unknown): boolean {
  if (result == null || typeof result !== 'object' || Array.isArray(result)) return false;
  const outcome = (result as { outcome?: unknown }).outcome;
  if (outcome == null || typeof outcome !== 'object' || Array.isArray(outcome)) return false;
  return (outcome as { outcome?: unknown }).outcome === 'accepted';
}

export function markPendingPlanExecute(ref: PendingPlanExecuteRef | undefined): void {
  if (ref) ref.value = true;
}

export function consumePendingPlanExecute(ref: PendingPlanExecuteRef | undefined): boolean {
  if (!ref?.value) return false;
  ref.value = false;
  return true;
}

export async function switchCursorSessionToAgentMode(
  transport: AcpSessionTransport,
  sessionId: string,
): Promise<void> {
  if (!transport.setSessionMode) return;
  try {
    await transport.setSessionMode({ sessionId, modeId: 'agent' });
  } catch {
    /* Already in agent mode, or the agent does not expose session/set_mode. */
  }
}
