import { describe, expect, it } from 'vitest';
import { isPromptQueued, queuedAnswer } from './queued-prompt.js';

describe('queued prompt collapse', () => {
  it('collapses question-originated prompt work', () => {
    expect(isPromptQueued({ prompt: 'Switch layout', origin: { kind: 'question', artifactId: 'a', subject: 's', questionId: 'q' } })).toBe(true);
    expect(isPromptQueued({ prompt: '', origin: { kind: 'draft', workId: 'd' } })).toBe(false);
    expect(queuedAnswer({ decisions: ['Use two columns'] })).toBe('Use two columns');
  });
});
