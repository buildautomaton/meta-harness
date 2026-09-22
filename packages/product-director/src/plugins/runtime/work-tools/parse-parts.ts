import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { ChangeKind } from '@/types/work/change.js';
import { CHANGE_KINDS } from '@/types/work/change.js';
import type { DataModelHighlight, DataModelInput } from '@/types/work/data-model.js';
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

export function parseDiagram(value: unknown): DataModelInput | undefined {
  const row = obj(value);
  if (!row) return undefined;
  const mermaid = str(row.mermaid);
  const whatChanged = str(row.whatChanged);
  if (!mermaid || !whatChanged) return undefined;
  const highlights = Array.isArray(row.highlights)
    ? row.highlights.map(parseHighlight).filter((h): h is DataModelHighlight => h !== undefined)
    : undefined;
  return { mermaid, whatChanged, ...(highlights?.length ? { highlights } : {}) };
}

function parseHighlight(value: unknown): DataModelHighlight | undefined {
  const row = obj(value);
  const ref = str(row?.ref);
  const change = str(row?.change) as ChangeKind | undefined;
  if (!ref || !change || !CHANGE_KINDS.includes(change)) return undefined;
  return { ref, change };
}
