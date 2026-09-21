import { describe, expect, it } from 'vitest';
import { visibleQuestions } from './visible-questions.js';

describe('visibleQuestions', () => {
  it('shows the first two until expanded', () => {
    expect(visibleQuestions(['a', 'b', 'c', 'd'], false)).toEqual(['a', 'b']);
    expect(visibleQuestions(['a', 'b', 'c', 'd'], true)).toEqual(['a', 'b', 'c', 'd']);
    expect(visibleQuestions(['a', 'b'], false)).toEqual(['a', 'b']);
  });
});
