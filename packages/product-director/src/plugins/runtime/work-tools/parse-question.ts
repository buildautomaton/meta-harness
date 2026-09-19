import type { DesignQuestion } from '@/types/work/questions.js';
import { parseChoice } from './parse-choice.js';
import { obj, str } from './parse-value.js';

export function parseQuestionList(value: unknown, max?: number): DesignQuestion[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map(parseQuestion).filter((q): q is DesignQuestion => q !== undefined);
  const kept = max == null ? items : items.slice(0, max);
  return kept.length ? kept : undefined;
}

export function parseQuestion(value: unknown): DesignQuestion | undefined {
  const row = obj(value);
  const id = str(row?.id);
  const prompt = str(row?.prompt);
  const context = str(row?.context) ?? '';
  const choices = Array.isArray(row?.choices)
    ? row.choices.map(parseChoice).filter((c): c is NonNullable<typeof c> => c !== undefined)
    : [];
  if (!id || !prompt || choices.length < 2) return undefined;
  return { id, prompt, context, choices: choices.slice(0, 4) };
}
