import { describe, expect, it, vi } from 'vitest';
import { resolveCursorIncomingRequest } from './cursor-incoming-resolve-request.js';
import type { PendingRequest } from './cursor-json-rpc-types.js';

describe('resolveCursorIncomingRequest', () => {
  it('marks pending plan execute when create_plan is accepted', () => {
    const pendingRequests = new Map<number | string, PendingRequest>();
    pendingRequests.set(1, { method: 'cursor/create_plan', params: { toolCallId: 'c1' } });
    const respond = vi.fn();
    const pendingPlanExecute = { value: false };
    resolveCursorIncomingRequest(
      pendingRequests,
      respond,
      1,
      { outcome: { outcome: 'accepted' } },
      undefined,
      pendingPlanExecute,
    );
    expect(pendingPlanExecute.value).toBe(true);
    expect(respond).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ outcome: expect.objectContaining({ outcome: 'accepted' }) }),
    );
  });

  it('does not mark pending execute on reject', () => {
    const pendingRequests = new Map<number | string, PendingRequest>();
    pendingRequests.set(1, { method: 'cursor/create_plan', params: {} });
    const pendingPlanExecute = { value: false };
    resolveCursorIncomingRequest(
      pendingRequests,
      vi.fn(),
      1,
      { outcome: { outcome: 'rejected' } },
      'sess-1',
      pendingPlanExecute,
    );
    expect(pendingPlanExecute.value).toBe(false);
  });
});
