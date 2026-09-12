import { describe, expect, it } from 'vitest';
import { transcriptTail } from './transcript.js';

describe('transcriptTail', () => {
  it('joins non-empty event text and keeps the last characters', () => {
    const text = transcriptTail([
      { ts: '1', kind: 'update', payload: { text: 'alpha' } },
      { ts: '2', kind: 'result', payload: { output: 'done' } },
    ]);
    expect(text).toBe('alpha\ndone');
    const tail = transcriptTail(
      [{ ts: '1', kind: 'update', payload: { text: 'abcdefghij' } }],
      4,
    );
    expect(tail).toBe('ghij');
  });
});
