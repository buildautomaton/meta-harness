export const QUESTION_PREVIEW = 2;

export function visibleQuestions<T>(items: T[], open: boolean, limit = QUESTION_PREVIEW): T[] {
  if (open || items.length <= limit) return items;
  return items.slice(0, limit);
}
