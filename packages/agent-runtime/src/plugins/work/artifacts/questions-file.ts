import { file } from './file.js';
import type { ArtifactFile } from '@/types/work/artifact.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { DesignQuestion } from '@/types/work/questions.js';
import { MODULES_QUESTIONS_KEY, OVERVIEW_QUESTIONS_KEY } from '@/types/work/questions.js';

export const QUESTIONS_FILE_PATH = 'questions.json';

export function questionsBySubject(input: SubmitWorkInput): Record<string, DesignQuestion[]> {
  const bySubject: Record<string, DesignQuestion[]> = {};
  if (input.questions?.overview?.length) bySubject[OVERVIEW_QUESTIONS_KEY] = input.questions.overview;
  if (input.questions?.modules?.length) bySubject[MODULES_QUESTIONS_KEY] = input.questions.modules;
  for (const item of input.questions?.ui ?? []) {
    if (item.questions.length) bySubject[`ui/${item.filename}`] = item.questions;
  }
  return bySubject;
}

export function parseQuestionsFile(content: string): Record<string, DesignQuestion[]> {
  try {
    const parsed = JSON.parse(content) as Record<string, DesignQuestion[]>;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function buildQuestionsFile(input: SubmitWorkInput): ArtifactFile[] {
  const bySubject = questionsBySubject(input);
  if (Object.keys(bySubject).length === 0) return [];
  return [file(QUESTIONS_FILE_PATH, `${JSON.stringify(bySubject, null, 2)}\n`)];
}
