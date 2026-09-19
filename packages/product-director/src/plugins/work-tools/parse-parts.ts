import type { SubmitWorkInput } from '@/types/work/submit.js';
import { obj, str } from './parse-value.js';

export { parseQuestions, parseQuestionList } from './parse-questions.js';

export function parseNamed(value: unknown): SubmitWorkInput['algorithm'] {
  const row = obj(value);
  const name = str(row?.name);
  const whatChanged = str(row?.whatChanged);
  const pseudocode = str(row?.pseudocode);
  if (!name || !whatChanged || !pseudocode) return undefined;
  return { name, whatChanged, pseudocode };
}

export function parseDiagram(value: unknown): SubmitWorkInput['dataModel'] {
  const row = obj(value);
  const mermaid = str(row?.mermaid);
  const whatChanged = str(row?.whatChanged);
  if (!mermaid || !whatChanged) return undefined;
  return { mermaid, whatChanged };
}

export function parseBackend(value: unknown): SubmitWorkInput['backend'] {
  const description = str(obj(value)?.description);
  return description ? { description } : undefined;
}
