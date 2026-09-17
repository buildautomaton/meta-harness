import type { Database } from 'node-sqlite3-wasm';
import type { DesignQuestion, QuestionAnswer } from '@/types/work/questions.js';
import type { InterviewAnswer } from '@/types/work/interview.js';
import { run } from './sql.js';
import { listWorkQuestions } from './decisions.js';
import { appendDecision } from './decisions.js';

export function replaceWorkQuestions(db: Database, workId: string, questions: DesignQuestion[]): void {
  run(db, 'DELETE FROM work_question WHERE work_id = ?', [workId]);
  for (const q of questions) {
    run(
      db,
      `INSERT INTO work_question (work_id, question_id, prompt, context, choices, answer_id)
       VALUES (?, ?, ?, ?, ?, NULL)`,
      [workId, q.id, q.prompt, q.context, JSON.stringify(q.choices)],
    );
  }
}

export function saveWorkAnswers(db: Database, workId: string, answers: QuestionAnswer[]): InterviewAnswer[] {
  const questions = listWorkQuestions(db, workId);
  const recorded: InterviewAnswer[] = [];
  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || question.answerId) continue;
    run(db, 'UPDATE work_question SET answer_id = ? WHERE work_id = ? AND question_id = ?', [
      answer.choiceId,
      workId,
      answer.questionId,
    ]);
    const label = question.choices.find((c) => c.id === answer.choiceId)?.label ?? answer.choiceId;
    appendDecision(db, workId, `${question.prompt}: ${label}`);
    recorded.push({ id: question.id, prompt: question.prompt, choiceId: answer.choiceId, label });
  }
  return recorded;
}

export function unansweredIds(questions: DesignQuestion[]): string[] {
  return questions.filter((q) => !q.answerId).map((q) => q.id);
}
