import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { QuestionOrigin, WorkOrigin } from '@/types/work/origin.js';
import { one } from './sql.js';

export function sourceKeyFor(artifactId: string, subject: string, questionId: string): string {
  return `${artifactId}:${subject}:${questionId}`;
}

export function parseQuestionSource(sourceKey: string): QuestionOrigin | undefined {
  const split = sourceKey.indexOf(':');
  if (split <= 0) return undefined;
  const rest = sourceKey.slice(split + 1);
  const last = rest.lastIndexOf(':');
  if (last <= 0) return undefined;
  return {
    kind: 'question',
    artifactId: sourceKey.slice(0, split),
    subject: rest.slice(0, last),
    questionId: rest.slice(last + 1),
  };
}

export function workOriginFor(sourceKey: string, workId: string): WorkOrigin {
  return parseQuestionSource(sourceKey) ?? { kind: 'draft', workId };
}

export function findBySource(db: SqlStore, sourceKey: string): string | undefined {
  try {
    const row = one(db, 'SELECT id FROM work WHERE source_key = ?', [sourceKey]);
    return row ? String(row.id) : undefined;
  } catch {
    return undefined;
  }
}

export function sourceStatus(db: SqlStore, sourceKey: string): string | undefined {
  try {
    const row = one(db, 'SELECT status FROM work WHERE source_key = ?', [sourceKey]);
    return row ? String(row.status) : undefined;
  } catch {
    return undefined;
  }
}

export function isPickedUp(status?: string): boolean {
  return status === 'in_progress' || status === 'completed';
}

export const ANSWER_LOCKED = 'ANSWER_LOCKED';
