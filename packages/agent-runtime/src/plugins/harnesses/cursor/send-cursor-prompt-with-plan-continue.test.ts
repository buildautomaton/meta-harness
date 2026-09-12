import { describe, expect, it, vi } from 'vitest';
import { sendCursorPromptWithPlanContinue } from './send-cursor-prompt-with-plan-continue.js';
import { CURSOR_PLAN_CONTINUE_PROMPT } from './cursor-plan-continue.js';
import type { AcpSessionContext } from '../../../runtime/harnesses/clients/acp-session-context.js';
import type { AcpSessionTransport } from '../../../runtime/harnesses/clients/acp-session-transport.js';

function ctx(pending: boolean): AcpSessionContext {
  return {
    cwd: '/tmp',
    mcpServers: [],
    persistedAcpSessionId: null,
    agentLabel: 'Cursor',
    suppressLoadReplay: { value: false },
    backendAgentType: 'cursor',
    agentConfig: null,
    logDebug: vi.fn(),
    getStderrText: () => '',
    pendingPlanExecute: { value: pending },
  };
}

describe('sendCursorPromptWithPlanContinue', () => {
  it('sends a follow-up implement prompt after create_plan accept', async () => {
    const prompt = vi.fn(async () => ({ stopReason: 'end_turn' }));
    const setSessionMode = vi.fn(async () => ({}));
    const transport = { prompt, setSessionMode } as unknown as AcpSessionTransport;
    const sessionCtx = ctx(true);
    await sendCursorPromptWithPlanContinue({
      transport,
      sessionCtx,
      sessionId: 'acp-1',
      prompt: 'original',
    });
    expect(prompt).toHaveBeenCalledTimes(2);
    expect(prompt).toHaveBeenLastCalledWith({
      sessionId: 'acp-1',
      prompt: [{ type: 'text', text: CURSOR_PLAN_CONTINUE_PROMPT }],
    });
    expect(setSessionMode).toHaveBeenCalledWith({ sessionId: 'acp-1', modeId: 'agent' });
    expect(sessionCtx.pendingPlanExecute?.value).toBe(false);
  });

  it('does not continue when the plan was not accepted', async () => {
    const prompt = vi.fn(async () => ({ stopReason: 'end_turn' }));
    const transport = { prompt } as unknown as AcpSessionTransport;
    await sendCursorPromptWithPlanContinue({
      transport,
      sessionCtx: ctx(false),
      sessionId: 'acp-1',
      prompt: 'original',
    });
    expect(prompt).toHaveBeenCalledTimes(1);
  });
});
