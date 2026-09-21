import { describe, expect, it, vi } from 'vitest';
import { removeQueued } from './remove-queued.js';
import type { WorkClient, WorkItem } from './types.js';

const item = { id: 'w1' } as WorkItem;

describe('removeQueued', () => {
  it('clears the review answer for question-origin queued work', async () => {
    const client = {
      answerQuestions: vi.fn().mockResolvedValue({ queued: [], removed: ['w1'] }),
      updateWork: vi.fn(),
    } as unknown as WorkClient;
    const origin = { kind: 'question' as const, artifactId: 'a1', subject: '__overview__', questionId: 'q1' };
    await removeQueued(client, item, origin);
    expect(client.answerQuestions).toHaveBeenCalledWith('a1', [
      { subject: '__overview__', questionId: 'q1', choiceId: '' },
    ]);
    expect(client.updateWork).not.toHaveBeenCalled();
  });
});
