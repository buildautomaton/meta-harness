import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { DesignChoice, QuestionAnswer } from '@/types/work/questions.js';
import type { WorkItem } from '@/types/work/records.js';
import { isStatusQuoChoice } from '@/types/work/questions.js';
import { titleFromPrompt } from './title-from.js';
import { upsertQueuedWork } from './upsert-queued.js';
import { type QuestionRow } from './find-question.js';
import { sourceKeyFor } from './source-key.js';
import { deleteQueuedBySource } from './delete-queued.js';
import { choiceForId } from './parse-stored-choices.js';

export function applyAnswerQueue(
  db: SqlStore,
  artifactId: string,
  answer: QuestionAnswer,
  row: QuestionRow,
): { queued?: WorkItem; removed?: string } {
  const choice = choiceForId(row.choices, answer.choiceId);
  const key = sourceKeyFor(artifactId, row.subject, answer.questionId);
  if (isStatusQuoChoice(choice)) {
    const removed = deleteQueuedBySource(db, key);
    return removed ? { removed } : {};
  }
  return { queued: enqueueChange(db, artifactId, answer, row, choice) };
}

function enqueueChange(
  db: SqlStore,
  artifactId: string,
  answer: QuestionAnswer,
  row: QuestionRow,
  choice: DesignChoice | undefined,
): WorkItem {
  const prompt = choice?.prompt || row.prompt || answer.questionId;
  const agentContext = choice?.context || row.context;
  const label = choice?.label ?? answer.choiceId;
  return upsertQueuedWork(db, {
    sourceKey: sourceKeyFor(artifactId, row.subject, answer.questionId),
    title: titleFromPrompt(prompt),
    prompt,
    agentContext,
    content: ['## Prompt', prompt, '', '## Answer', label, '', '## Context', agentContext].join('\n'),
    decisions: [label],
  });
}
