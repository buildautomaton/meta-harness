import type { SqlStore } from '@buildautomaton/runtime';
import type { DesignQuestion } from '@/types/work/questions.js';
import type { InterviewRound } from '@/types/work/interview.js';
import type { WorkHub } from './hub.js';
import { getWorkRow } from './read-work.js';
import { replaceWorkQuestions } from './interview.js';
import { insertSession } from './sessions.js';
import { isoNow } from './rank.js';
import { run } from './sql.js';
import { bottomRank } from './move-queue.js';

export async function submitInterview(
  db: SqlStore,
  hub: WorkHub,
  workId: string,
  questions: DesignQuestion[],
  sessionId?: string,
): Promise<InterviewRound> {
  const item = getWorkRow(db, workId);
  if (!item) throw new Error('Work not found');
  if (questions.length > 0 && item.status !== 'draft') {
    throw new Error('Interview questions are only for draft work');
  }
  if (sessionId) insertSession(db, { sessionId, workId, status: 'picked_up', createdAt: isoNow() });
  if (questions.length === 0) {
    run(db, "UPDATE work SET status = 'queued', queue_rank = ?, updated_at = ? WHERE id = ?", [
      bottomRank(db),
      isoNow(),
      workId,
    ]);
    hub.emit('work.changed', workId);
    return { done: true, item: getWorkRow(db, workId)! };
  }
  if (hub.interviewing.has(workId)) throw new Error('Interview already in progress for this draft');
  replaceWorkQuestions(db, workId, questions);
  const waiting = hub.waitForAnswers(workId);
  hub.emit('work.changed', workId);
  const answers = await waiting;
  return { done: false, item: getWorkRow(db, workId)!, answers };
}
