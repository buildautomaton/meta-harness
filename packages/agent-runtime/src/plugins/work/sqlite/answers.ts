import type { Database } from 'node-sqlite3-wasm';
import type { QuestionAnswer } from '@/types/work/questions.js';
import { run } from './sql.js';

export function saveAnswers(db: Database, artifactId: string, answers: QuestionAnswer[]): void {
  for (const answer of answers) {
    run(
      db,
      `UPDATE artifact_question SET answer_id = ?
       WHERE artifact_id = ? AND subject = ? AND question_id = ?`,
      [answer.choiceId, artifactId, answer.subject, answer.questionId],
    );
  }
}
