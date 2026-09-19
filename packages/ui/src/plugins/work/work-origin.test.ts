import { describe, expect, it } from 'vitest';
import { isDraftColumnItem } from './draft-column-item.js';
import { childScrollTop } from './reveal-element.js';
import { artifactOriginId, draftOriginId, originTargetIds, questionOriginId } from './work-origin.js';

describe('childScrollTop', () => {
  it('moves the parent so the child sits near the top', () => {
    expect(childScrollTop(400, 100, 50, 8)).toBe(342);
    expect(childScrollTop(80, 100, 0, 8)).toBe(0);
  });
});

describe('work origin ids', () => {
  const question = {
    kind: 'question' as const,
    artifactId: 'art-1',
    subject: '__overview__',
    questionId: 'layout',
  };

  it('avoids colons so getElementById can find the question', () => {
    const id = questionOriginId(question);
    expect(id).not.toContain(':');
    expect(originTargetIds(question)[0]).toBe(id);
    expect(originTargetIds(question)[1]).toBe(artifactOriginId('art-1'));
    expect(originTargetIds({ kind: 'draft', workId: 'work-1' })).toEqual([draftOriginId('work-1')]);
    expect(isDraftColumnItem({ status: 'queued', origin: { kind: 'draft', workId: 'work-1' } })).toBe(true);
    expect(isDraftColumnItem({ status: 'queued', origin: question })).toBe(false);
  });
});
