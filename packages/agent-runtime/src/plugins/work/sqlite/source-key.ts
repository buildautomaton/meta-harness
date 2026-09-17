import type { Database } from 'node-sqlite3-wasm';
import { one } from './sql.js';

export function sourceKeyFor(artifactId: string, subject: string, questionId: string): string {
  return `${artifactId}:${subject}:${questionId}`;
}

export function findBySource(db: Database, sourceKey: string): string | undefined {
  try {
    const row = one(db, 'SELECT id FROM work WHERE source_key = ?', [sourceKey]);
    return row ? String(row.id) : undefined;
  } catch {
    return undefined;
  }
}

export function sourceStatus(db: Database, sourceKey: string): string | undefined {
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
