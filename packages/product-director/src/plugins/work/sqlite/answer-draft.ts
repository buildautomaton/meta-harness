import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { QuestionAnswer } from '@/types/work/questions.js';
import type { WorkItem } from '@/types/work/records.js';
import type { InterviewAnswer } from '@/types/work/interview.js';
import type { WorkHub } from './hub.js';
import { getWorkRow } from './read-work.js';
import { listWorkQuestions } from './decisions.js';
import { saveWorkAnswers, unansweredIds } from './interview.js';
import { run } from './sql.js';

export function answerDraftQuestions(
  db: SqlStore,
  hub: WorkHub,
  workId: string,
  answers: QuestionAnswer[],
): WorkItem | null {
  if (!getWorkRow(db, workId)) return null;
  saveWorkAnswers(db, workId, answers);
  const questions = listWorkQuestions(db, workId);
  const remaining = unansweredIds(questions);
  hub.emit('answers.changed', workId);
  hub.emit('work.changed', workId);
  if (remaining.length === 0) {
    hub.resolveAnswers(workId, asInterviewAnswers(questions));
    run(db, 'DELETE FROM work_question WHERE work_id = ?', [workId]);
    hub.emit('work.changed', workId);
  }
  return getWorkRow(db, workId);
}

function asInterviewAnswers(questions: ReturnType<typeof listWorkQuestions>): InterviewAnswer[] {
  return questions
    .filter((q) => q.answerId)
    .map((q) => ({
      id: q.id,
      prompt: q.prompt,
      choiceId: q.answerId as string,
      label: q.choices.find((c) => c.id === q.answerId)?.label ?? q.answerId!,
    }));
}
