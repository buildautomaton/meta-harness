import { describe, expect, it } from 'vitest';
import { parseQuestions } from './parse-questions.js';
import { parseQuestionList } from './parse-question.js';

const change = {
  id: 'q1',
  prompt: 'Keep this layout?',
  choices: [
    { id: 'keep', label: 'Keep', kind: 'status_quo' },
    {
      id: 'change',
      label: 'Two columns',
      kind: 'change',
      prompt: 'Switch checkout to two columns',
      context: 'Edit ui/checkout.html',
    },
  ],
};

describe('parseQuestions', () => {
  it('parses change prompt and context on the answer, not the question', () => {
    const parsed = parseQuestions({ overview: [change] });
    const question = parsed?.overview?.[0];
    expect(question?.context).toBe('');
    expect(question?.choices[0]?.kind).toBe('status_quo');
    expect(question?.choices[1]).toMatchObject({
      kind: 'change',
      prompt: 'Switch checkout to two columns',
      context: 'Edit ui/checkout.html',
    });
  });

  it('infers status_quo when kind is missing and there is no follow-up work', () => {
    const parsed = parseQuestions({
      overview: [
        {
          id: 'q1',
          prompt: 'Keep this?',
          choices: [
            { id: 'keep', label: 'Keep' },
            { id: 'change', label: 'Change', prompt: 'Do the change', context: 'Touch files' },
          ],
        },
      ],
    });
    expect(parsed?.overview?.[0]?.choices[0]?.kind).toBe('status_quo');
    expect(parsed?.overview?.[0]?.choices[1]?.kind).toBe('change');
  });

  it('caps review questions at three per section', () => {
    const q = (id: string) => ({ ...change, id });
    const parsed = parseQuestions({
      overview: Array.from({ length: 8 }, (_, i) => q(`o${i}`)),
      modules: Array.from({ length: 4 }, (_, i) => q(`m${i}`)),
    });
    expect(parsed?.overview).toHaveLength(3);
    expect(parsed?.modules).toHaveLength(3);
  });
});

describe('parseQuestionList', () => {
  it('accepts interview questions that still send context', () => {
    const list = parseQuestionList(
      [{ ...change, context: 'Decide layout', choices: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] }],
      1,
    );
    expect(list?.[0]?.context).toBe('Decide layout');
  });
});
