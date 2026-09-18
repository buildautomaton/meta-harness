import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { QuestionAnswer } from '@/types/work/questions.js';
import { run } from './sql.js';
import { findQuestion } from './find-question.js';
import { ANSWER_LOCKED, isPickedUp, sourceKeyFor, sourceStatus } from './source-key.js';
import { deleteQueuedBySource } from './delete-queued.js';

export function clearAnswer(db: SqlStore, artifactId: string, answer: QuestionAnswer): string | undefined {
  const row = findQuestion(db, artifactId, answer.subject, answer.questionId);
  const subject = row?.subject ?? answer.subject;
  const key = sourceKeyFor(artifactId, subject, answer.questionId);
  if (isPickedUp(sourceStatus(db, key))) throw new Error(ANSWER_LOCKED);
  run(
    db,
    `UPDATE artifact_question SET answer_id = NULL
     WHERE artifact_id = ? AND question_id = ?`,
    [artifactId, answer.questionId],
  );
  return deleteQueuedBySource(db, key);
}
