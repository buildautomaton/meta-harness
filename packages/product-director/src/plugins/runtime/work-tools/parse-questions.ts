import type { ReviewQuestions } from '@/types/work/questions.js';
import { parseQuestionList } from './parse-question.js';
import { obj, str } from './parse-value.js';

export { parseQuestionList } from './parse-question.js';

export function parseQuestions(value: unknown): ReviewQuestions | undefined {
  const row = obj(value);
  if (!row) return undefined;
  return {
    overview: parseQuestionList(row.overview, 3),
    modules: parseQuestionList(row.modules, 3),
    ui: parseUiQuestions(row.ui),
  };
}

function parseUiQuestions(value: unknown): ReviewQuestions['ui'] {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .map((item) => {
      const row = obj(item);
      const filename = str(row?.filename);
      const questions = parseQuestionList(row?.questions, 3);
      return filename && questions ? { filename, questions } : undefined;
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
  return items.length ? items : undefined;
}
