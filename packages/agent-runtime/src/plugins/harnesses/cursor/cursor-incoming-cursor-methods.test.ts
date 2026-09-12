import { describe, expect, it, vi } from 'vitest';
import {
  handleCursorIncomingCursorMethods,
  handleCursorIncomingCursorNotification,
} from './cursor-incoming-cursor-methods.js';
import type { PendingRequest } from './cursor-json-rpc-types.js';

describe('handleCursorIncomingCursorMethods cursor/task', () => {
  it('forwards cursor/task via onSessionUpdate and does not queue onRequest', () => {
    const respond = vi.fn();
    const onRequest = vi.fn();
    const onSessionUpdate = vi.fn();
    const pendingRequests = new Map<number | string, PendingRequest>();
    const handled = handleCursorIncomingCursorMethods(
      'cursor/task',
      42,
      {
        params: {
          toolCallId: 'call_9',
          description: 'Explore',
          prompt: 'Find files',
          subagentType: 'explore',
        },
      },
      { respond, onRequest, onSessionUpdate, pendingRequests },
    );
    expect(handled).toBe(true);
    expect(onRequest).not.toHaveBeenCalled();
    expect(pendingRequests.size).toBe(0);
    expect(respond).toHaveBeenCalledWith(42, {});
    expect(onSessionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ toolCallId: 'call_9', title: 'Explore' }),
    );
  });
});

describe('handleCursorIncomingCursorNotification', () => {
  it('forwards cursor/task without a JSON-RPC id so in-progress titles enrich', () => {
    const onSessionUpdate = vi.fn();
    expect(
      handleCursorIncomingCursorNotification(
        'cursor/task',
        {
          params: {
            toolCallId: 'call_9',
            description: 'Explore codebase',
            subagentType: 'explore',
          },
        },
        onSessionUpdate,
      ),
    ).toBe(true);
    expect(onSessionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ toolCallId: 'call_9', title: 'Explore codebase' }),
    );
  });
});
