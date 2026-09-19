import { describe, expect, it } from 'vitest';
import { decisionFromElicitation } from './permission-result.js';

describe('decisionFromElicitation', () => {
  it('retries when the form is cancelled and accepts a real choice', () => {
    expect(decisionFromElicitation({ action: 'cancel' })).toBeUndefined();
    expect(decisionFromElicitation({ action: 'decline' })).toEqual({ outcome: { outcome: 'denied' } });
    expect(
      decisionFromElicitation(
        { action: 'accept', content: { optionId: 'allow-once' } },
        { options: [{ optionId: 'allow-once' }] },
      ),
    ).toEqual({ outcome: { outcome: 'selected', optionId: 'allow-once' } });
  });
});
