import { describe, expect, it } from 'vitest';
import { decisionFromSample } from './sample-decision.js';

describe('decisionFromSample', () => {
  it('maps coordinator permission-mode replies', () => {
    expect(decisionFromSample({ content: { type: 'text', text: '{"decision":"allow-once"}' } })).toEqual({
      action: 'accept',
      content: { optionId: 'allow-once' },
    });
    expect(decisionFromSample({ content: { type: 'text', text: 'ask-user' } })).toBeUndefined();
    expect(decisionFromSample({ content: { type: 'text', text: 'reject' } })).toEqual({ action: 'decline' });
  });
});
