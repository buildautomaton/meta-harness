import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { DesignQuestion } from '@/types/work/questions.js';
import { QUESTIONS_FILE_PATH, parseQuestionsFile } from '@plugins/work/artifacts/questions-file.js';
import { all, one } from './sql.js';

export type QuestionRow = {
  subject: string;
  prompt: string;
  context: string;
  choices: string;
};

export function findQuestion(
  db: SqlStore,
  artifactId: string,
  subject: string,
  questionId: string,
): QuestionRow | undefined {
  const rows = all(db, 'SELECT * FROM artifact_question WHERE artifact_id = ?', [artifactId]);
  const match =
    rows.find((row) => String(row.subject) === subject && String(row.question_id) === questionId) ??
    rows.find((row) => String(row.question_id) === questionId);
  if (match) {
    return {
      subject: String(match.subject),
      prompt: String(match.prompt ?? ''),
      context: String(match.context ?? ''),
      choices: String(match.choices ?? '[]'),
    };
  }
  return fromQuestionsFile(db, artifactId, subject, questionId);
}

function fromQuestionsFile(
  db: SqlStore,
  artifactId: string,
  subject: string,
  questionId: string,
): QuestionRow | undefined {
  const file = one(db, 'SELECT content FROM artifact_file WHERE artifact_id = ? AND path = ?', [
    artifactId,
    QUESTIONS_FILE_PATH,
  ]);
  if (!file) return undefined;
  const bySubject = parseQuestionsFile(String(file.content));
  const listed = bySubject[subject] ?? [];
  const question =
    listed.find((item) => item.id === questionId) ??
    Object.values(bySubject)
      .flat()
      .find((item: DesignQuestion) => item.id === questionId);
  if (!question) return undefined;
  const foundSubject =
    listed.some((item) => item.id === questionId) ? subject : subjectFor(bySubject, questionId) ?? subject;
  return {
    subject: foundSubject,
    prompt: question.prompt,
    context: question.context,
    choices: JSON.stringify(question.choices),
  };
}

function subjectFor(bySubject: Record<string, DesignQuestion[]>, questionId: string): string | undefined {
  return Object.entries(bySubject).find(([, items]) => items.some((item) => item.id === questionId))?.[0];
}
