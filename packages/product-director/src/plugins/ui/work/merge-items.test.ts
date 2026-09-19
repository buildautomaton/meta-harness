import { describe, expect, it } from 'vitest';
import { dropById, isQueuedItem, mergeItems } from './merge-items.js';
import type { WorkItem } from './types.js';

const item = (id: string, status: WorkItem['status']): WorkItem => ({
  id,
  title: id,
  content: '',
  status,
  priority: 'medium',
  queueRank: 0,
  paused: false,
  prompt: 'Prompt',
  agentContext: 'Context',
  origin: { kind: 'question', artifactId: 'art', subject: '__overview__', questionId: 'q1' },
  decisions: ['Change'],
  questions: [],
  sessionIds: [],
  createdAt: '',
  updatedAt: '',
  completedAt: null,
});

describe('mergeItems', () => {
  it('adds queued work returned from answering a question', () => {
    const current = [item('draft', 'draft')];
    const queued = item('follow-up', 'queued');
    const next = mergeItems(current, [queued]);
    expect(next.map((row) => row.id)).toEqual(['draft', 'follow-up']);
    expect(next.filter(isQueuedItem)).toEqual([queued]);
  });

  it('drops queued work after an answer is cleared', () => {
    const queued = item('follow-up', 'queued');
    const next = dropById([item('draft', 'draft'), queued], [queued.id]);
    expect(next.filter(isQueuedItem)).toEqual([]);
  });
});
