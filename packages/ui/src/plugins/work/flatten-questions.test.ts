import { describe, expect, it } from 'vitest';
import { flattenQuestions, subjectLabel } from './flatten-questions.js';
import type { DesignQuestion } from './types.js';

const q = (id: string, prompt: string): DesignQuestion => ({
  id,
  prompt,
  context: '',
  choices: [
    { id: 'a', label: 'Yes' },
    { id: 'b', label: 'No' },
  ],
});

describe('flattenQuestions', () => {
  it('numbers subjects in object order', () => {
    const items = flattenQuestions({
      'overview.md': [q('keep', 'Keep this layout?')],
      __modules__: [q('split', 'Split the module?')],
    });
    expect(items.map((row) => row.key)).toEqual(['overview.md:keep', '__modules__:split']);
    expect(items.map((row) => row.subjectLabel)).toEqual(['Overview', 'Modules']);
  });
});

describe('subjectLabel', () => {
  it('humanizes file names', () => {
    expect(subjectLabel('overview.md')).toBe('Overview');
    expect(subjectLabel('ui/home.html')).toBe('home');
  });
});
