import { describe, expect, it, vi } from 'vitest';
import {
  consumePendingPlanExecute,
  CURSOR_PLAN_CONTINUE_PROMPT,
  isAcceptedCreatePlanRpcResult,
  markPendingPlanExecute,
  switchCursorSessionToAgentMode,
} from './cursor-plan-continue.js';

describe('cursor plan continue', () => {
  it('detects nested accepted create_plan results', () => {
    expect(isAcceptedCreatePlanRpcResult({ outcome: { outcome: 'accepted', planUri: 'file://x' } })).toBe(
      true,
    );
    expect(isAcceptedCreatePlanRpcResult({ outcome: { outcome: 'rejected' } })).toBe(false);
    expect(isAcceptedCreatePlanRpcResult({ outcome: 'accepted' })).toBe(false);
  });

  it('marks and consumes the pending-execute flag once', () => {
    const ref = { value: false };
    markPendingPlanExecute(ref);
    expect(consumePendingPlanExecute(ref)).toBe(true);
    expect(consumePendingPlanExecute(ref)).toBe(false);
    expect(CURSOR_PLAN_CONTINUE_PROMPT.length).toBeGreaterThan(20);
  });

  it('sends session/set_mode agent when the transport supports it', async () => {
    const setSessionMode = vi.fn(async () => ({}));
    await switchCursorSessionToAgentMode({ setSessionMode } as never, 'sess');
    expect(setSessionMode).toHaveBeenCalledWith({ sessionId: 'sess', modeId: 'agent' });
  });
});
