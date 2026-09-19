import { describe, expect, it, vi } from 'vitest';
import { buildCursorTaskToolCallUpdate, handleCursorIncomingCursorTask } from './cursor-incoming-cursor-task.js';

describe('buildCursorTaskToolCallUpdate', () => {
  it('builds a tool_call_update with description as title', () => {
    expect(
      buildCursorTaskToolCallUpdate({
        toolCallId: 'call_126',
        description: 'Explore codebase',
        prompt: 'Find auth handlers',
        subagentType: 'explore',
      }),
    ).toEqual({
      sessionUpdate: 'tool_call_update',
      toolCallId: 'call_126',
      title: 'Explore codebase',
      cursorTask: {
        description: 'Explore codebase',
        prompt: 'Find auth handlers',
        subagentType: 'explore',
      },
    });
  });

  it('forwards duration and background flags onto cursorTask', () => {
    expect(
      buildCursorTaskToolCallUpdate({
        toolCallId: 'call_9',
        description: 'Explore',
        durationMs: 89078,
        isBackground: false,
      }),
    ).toEqual({
      sessionUpdate: 'tool_call_update',
      toolCallId: 'call_9',
      title: 'Explore',
      cursorTask: {
        description: 'Explore',
        durationMs: 89078,
        isBackground: false,
      },
    });
  });

  it('returns null without toolCallId', () => {
    expect(buildCursorTaskToolCallUpdate({ description: 'x' })).toBeNull();
  });

  it('reads description from a nested task object', () => {
    expect(
      buildCursorTaskToolCallUpdate({
        toolCallId: 'call_3',
        task: { description: 'Review PR diffs', prompt: 'Check the diff', subagentType: 'explore' },
      }),
    ).toEqual({
      sessionUpdate: 'tool_call_update',
      toolCallId: 'call_3',
      title: 'Review PR diffs',
      cursorTask: {
        description: 'Review PR diffs',
        prompt: 'Check the diff',
        subagentType: 'explore',
      },
    });
  });

  it('ignores zero durationMs so in-progress ticks are not replaced', () => {
    const update = buildCursorTaskToolCallUpdate({
      toolCallId: 'call_4',
      description: 'Explore',
      durationMs: 0,
    });
    expect((update?.cursorTask as { durationMs?: number } | undefined)?.durationMs).toBeUndefined();
  });
});

describe('handleCursorIncomingCursorTask', () => {
  it('acks and forwards a synthetic session update', () => {
    const respond = vi.fn();
    const onSessionUpdate = vi.fn();
    handleCursorIncomingCursorTask(
      7,
      {
        params: {
          toolCallId: 'call_1',
          description: 'Explore',
          prompt: 'Look around',
          subagentType: 'explore',
        },
      },
      { respond, onSessionUpdate },
    );
    expect(respond).toHaveBeenCalledWith(7, {});
    expect(onSessionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionUpdate: 'tool_call_update',
        toolCallId: 'call_1',
        title: 'Explore',
      }),
    );
  });

  it('forwards notifications without a JSON-RPC id', () => {
    const respond = vi.fn();
    const onSessionUpdate = vi.fn();
    handleCursorIncomingCursorTask(
      null,
      { params: { toolCallId: 'call_2', description: 'Shell task', subagentType: 'shell' } },
      { respond, onSessionUpdate },
    );
    expect(respond).not.toHaveBeenCalled();
    expect(onSessionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ toolCallId: 'call_2', title: 'Shell task' }),
    );
  });
});
