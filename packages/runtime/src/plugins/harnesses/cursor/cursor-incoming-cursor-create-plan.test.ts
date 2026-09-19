import { describe, expect, it, vi } from 'vitest';
import { handleCursorIncomingCursorMethods } from './cursor-incoming-cursor-methods.js';
import type { PendingRequest } from './cursor-json-rpc-types.js';

describe('handleCursorIncomingCursorMethods cursor/create_plan', () => {
  it('queues onRequest and emits a synthetic tool_call with cursorPlan', () => {
    const respond = vi.fn();
    const onRequest = vi.fn();
    const onSessionUpdate = vi.fn();
    const pendingRequests = new Map<number | string, PendingRequest>();
    const handled = handleCursorIncomingCursorMethods(
      'cursor/create_plan',
      7,
      {
        params: {
          toolCallId: 'call_plan',
          name: 'Refactor tabs',
          overview: 'Tighten layout',
          plan: '# Steps\n\n1. Inspect',
          todos: [{ id: 't1', content: 'Inspect', status: 'pending' }],
        },
      },
      { respond, onRequest, onSessionUpdate, pendingRequests },
    );
    expect(handled).toBe(true);
    expect(respond).not.toHaveBeenCalled();
    expect(pendingRequests.get(7)?.method).toBe('cursor/create_plan');
    expect(onRequest).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: '7', method: 'cursor/create_plan' }),
    );
    expect(onSessionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionUpdate: 'tool_call',
        toolCallId: 'call_plan',
        title: 'Refactor tabs',
        cursorPlan: expect.objectContaining({
          requestId: '7',
          name: 'Refactor tabs',
          plan: '# Steps\n\n1. Inspect',
        }),
      }),
    );
  });
});
