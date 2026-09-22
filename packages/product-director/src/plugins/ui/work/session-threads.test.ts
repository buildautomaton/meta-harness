import { describe, expect, it } from 'vitest';
import { sessionThreads } from './session-threads.js';
import type { WorkArtifact } from './types.js';

function artifact(partial: Partial<WorkArtifact> & Pick<WorkArtifact, 'id' | 'createdAt'>): WorkArtifact {
  return {
    workId: null,
    title: partial.id,
    description: '',
    kinds: [],
    sessionId: null,
    files: [],
    questions: {},
    project: 'P',
    ...partial,
  };
}

describe('sessionThreads', () => {
  it('keeps null session artifacts separate and orders by latest', () => {
    const threads = sessionThreads([
      artifact({ id: 'a', createdAt: '2026-01-02T00:00:00.000Z' }),
      artifact({ id: 'b', createdAt: '2026-01-03T00:00:00.000Z' }),
    ]);
    expect(threads.map((t) => t.key)).toEqual(['artifact:b', 'artifact:a']);
  });

  it('groups shared session ids with oldest first and latest on top of the feed', () => {
    const threads = sessionThreads([
      artifact({ id: 'new', createdAt: '2026-01-03T00:00:00.000Z', sessionId: 's1' }),
      artifact({ id: 'old', createdAt: '2026-01-01T00:00:00.000Z', sessionId: 's1' }),
      artifact({ id: 'mid', createdAt: '2026-01-02T00:00:00.000Z', sessionId: 's1' }),
      artifact({ id: 'other', createdAt: '2026-01-04T00:00:00.000Z', sessionId: 's2' }),
    ]);
    expect(threads.map((t) => t.key)).toEqual(['session:s2', 'session:s1']);
    expect(threads[1]?.artifacts.map((a) => a.id)).toEqual(['old', 'mid', 'new']);
  });
});
