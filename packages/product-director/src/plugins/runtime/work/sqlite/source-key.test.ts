import { describe, expect, it } from 'vitest';
import { parseQuestionSource, sourceKeyFor, workOriginFor } from './source-key.js';

describe('question source keys', () => {
  it('round-trips artifact, subject, and question id', () => {
    const key = sourceKeyFor('art-1', 'ui/checkout.html', 'layout');
    expect(parseQuestionSource(key)).toEqual({
      kind: 'question',
      artifactId: 'art-1',
      subject: 'ui/checkout.html',
      questionId: 'layout',
    });
  });

  it('treats work without a question source as a draft origin', () => {
    expect(workOriginFor('', 'work-1')).toEqual({ kind: 'draft', workId: 'work-1' });
    expect(parseQuestionSource('')).toBeUndefined();
  });
});
