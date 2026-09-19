import { describe, expect, it } from 'vitest';
import { resolveWorkOrigin } from './resolve-origin.js';

const artifacts = [
  {
    id: 'art-1',
    questions: {
      __overview__: [
        {
          id: 'intro',
          prompt: 'Is this the right intro?',
          context: '',
          choices: [{ id: 'watch', label: 'Use watch instead', prompt: 'Switch intro copy' }],
          answerId: 'watch',
        },
      ],
    },
  },
];

describe('resolveWorkOrigin', () => {
  it('keeps an explicit origin from the API', () => {
    const question = { kind: 'question' as const, artifactId: 'a', subject: 's', questionId: 'q' };
    expect(resolveWorkOrigin({ id: 'w', prompt: '', title: '', decisions: [], origin: question }, [])).toEqual(
      question,
    );
    expect(
      resolveWorkOrigin({ id: 'w', prompt: '', title: '', decisions: [], origin: { kind: 'draft', workId: 'w' } }, artifacts)
        .kind,
    ).toBe('draft');
  });

  it('infers a question origin from the review prompt or follow-up prompt', () => {
    const base = { id: 'w', title: 'Is this the right intro?', decisions: ['Use watch instead'] };
    expect(resolveWorkOrigin({ ...base, prompt: 'Is this the right intro?' }, artifacts)).toEqual({
      kind: 'question',
      artifactId: 'art-1',
      subject: '__overview__',
      questionId: 'intro',
    });
    expect(resolveWorkOrigin({ ...base, prompt: 'Switch intro copy' }, artifacts).kind).toBe('question');
    expect(resolveWorkOrigin({ id: 'w', prompt: 'Unrelated draft', title: 'Draft', decisions: [] }, artifacts)).toEqual({
      kind: 'draft',
      workId: 'w',
    });
  });
});
