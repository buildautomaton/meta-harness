import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { AnswerQuestionsResult } from '@/types/work/implementation.js';
import type { QuestionAnswer } from '@/types/work/questions.js';
import type { WorkItem } from '@/types/work/records.js';
import { run } from './sql.js';
import { titleFromPrompt } from './title-from.js';
import { upsertQueuedWork } from './upsert-queued.js';
import { findQuestion, type QuestionRow } from './find-question.js';
import { sourceKeyFor } from './source-key.js';
import { clearAnswer } from './clear-answer.js';

export function saveAnswers(db: SqlStore, artifactId: string, answers: QuestionAnswer[]): AnswerQuestionsResult {
  const queued: WorkItem[] = [];
  const removed: string[] = [];
  for (const answer of Array.isArray(answers) ? answers : []) {
    if (!answer?.questionId) continue;
    if (!answer.choiceId) {
      const id = clearAnswer(db, artifactId, answer);
      if (id) removed.push(id);
      continue;
    }
    const row = findQuestion(db, artifactId, answer.subject, answer.questionId) ?? fallbackRow(answer);
    persistAnswer(db, artifactId, answer, row);
    queued.push(enqueueAnswer(db, artifactId, answer, row));
  }
  return { queued, removed };
}

function fallbackRow(answer: QuestionAnswer): QuestionRow {
  return { subject: answer.subject, prompt: answer.questionId, context: '', choices: '[]' };
}

function persistAnswer(db: SqlStore, artifactId: string, answer: QuestionAnswer, row: QuestionRow): void {
  run(
    db,
    `INSERT INTO artifact_question
     (artifact_id, subject, question_id, prompt, context, choices, answer_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(artifact_id, subject, question_id) DO UPDATE SET answer_id = excluded.answer_id`,
    [artifactId, row.subject, answer.questionId, row.prompt, row.context, row.choices, answer.choiceId],
  );
}

function parseChoices(raw: string): { id: string; label: string }[] {
  try {
    const parsed = JSON.parse(raw) as { id: string; label: string }[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function enqueueAnswer(
  db: SqlStore,
  artifactId: string,
  answer: QuestionAnswer,
  row: QuestionRow,
): WorkItem {
  const prompt = row.prompt || answer.questionId;
  const label = parseChoices(row.choices).find((c) => c.id === answer.choiceId)?.label ?? answer.choiceId;
  return upsertQueuedWork(db, {
    sourceKey: sourceKeyFor(artifactId, row.subject, answer.questionId),
    title: titleFromPrompt(prompt),
    prompt,
    agentContext: row.context,
    content: ['## Prompt', prompt, '', '## Answer', label, '', '## Context', row.context].join('\n'),
    decisions: [label],
  });
}
