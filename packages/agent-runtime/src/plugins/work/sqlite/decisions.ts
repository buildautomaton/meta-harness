import type { Database } from 'node-sqlite3-wasm';
import type { DesignQuestion } from '@/types/work/questions.js';
import { all, run } from './sql.js';

export function listDecisions(db: Database, workId: string): string[] {
  return all(db, 'SELECT text FROM work_decision WHERE work_id = ? ORDER BY ordinal ASC', [workId]).map((row) =>
    String(row.text),
  );
}

export function replaceDecisions(db: Database, workId: string, decisions: string[]): void {
  run(db, 'DELETE FROM work_decision WHERE work_id = ?', [workId]);
  decisions.forEach((text, ordinal) => {
    run(db, 'INSERT INTO work_decision (work_id, ordinal, text) VALUES (?, ?, ?)', [workId, ordinal, text]);
  });
}

export function appendDecision(db: Database, workId: string, text: string): void {
  const rows = all(db, 'SELECT MAX(ordinal) AS max_ord FROM work_decision WHERE work_id = ?', [workId]);
  const next = Number(rows[0]?.max_ord ?? -1) + 1;
  run(db, 'INSERT INTO work_decision (work_id, ordinal, text) VALUES (?, ?, ?)', [workId, next, text]);
}

export function listWorkQuestions(db: Database, workId: string): DesignQuestion[] {
  return all(db, 'SELECT * FROM work_question WHERE work_id = ?', [workId]).map((row) => ({
    id: String(row.question_id),
    prompt: String(row.prompt),
    context: String(row.context),
    choices: JSON.parse(String(row.choices)) as DesignQuestion['choices'],
    answerId: row.answer_id == null ? null : String(row.answer_id),
  }));
}
