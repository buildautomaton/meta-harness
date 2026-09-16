import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { DesignQuestion, ReviewQuestions } from '@/types/work/questions.js';

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function obj(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

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

export function parseQuestions(value: unknown): ReviewQuestions | undefined {
  const row = obj(value);
  if (!row) return undefined;
  return {
    overview: parseQuestionList(row.overview),
    modules: parseQuestionList(row.modules),
    ui: parseUiQuestions(row.ui),
  };
}

function parseQuestionList(value: unknown): DesignQuestion[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map(parseQuestion).filter((q): q is DesignQuestion => q !== undefined);
  return items.length ? items.slice(0, 3) : undefined;
}

function parseQuestion(value: unknown): DesignQuestion | undefined {
  const row = obj(value);
  const id = str(row?.id);
  const prompt = str(row?.prompt);
  const context = str(row?.context);
  const choices = Array.isArray(row?.choices)
    ? row.choices
        .map((c) => {
          const choice = obj(c);
          const cid = str(choice?.id);
          const label = str(choice?.label);
          return cid && label ? { id: cid, label } : undefined;
        })
        .filter((c): c is { id: string; label: string } => c !== undefined)
    : [];
  if (!id || !prompt || !context || choices.length < 2) return undefined;
  return { id, prompt, context, choices: choices.slice(0, 4) };
}

function parseUiQuestions(value: unknown): ReviewQuestions['ui'] {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .map((item) => {
      const row = obj(item);
      const filename = str(row?.filename);
      const questions = parseQuestionList(row?.questions);
      return filename && questions ? { filename, questions } : undefined;
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
  return items.length ? items : undefined;
}
