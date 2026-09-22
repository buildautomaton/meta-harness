import type { SqlStore } from '@buildautomaton/runtime';
import type { DesignQuestion } from '@/types/work/questions.js';
import type { InterviewRound } from '@/types/work/interview.js';
import type { WorkHub } from './hub.js';
import { getWorkRow } from './read-work.js';
import { replaceWorkQuestions } from './interview.js';
import { insertSession } from './sessions.js';
import { isoNow } from './rank.js';
import { promoteToQueue } from './queue-draft.js';

const DROPPED: InterviewRound = { done: true };

export async function submitInterview(
  db: SqlStore,
  hub: WorkHub,
  workId: string,
  questions: DesignQuestion[],
  sessionId?: string,
): Promise<InterviewRound> {
  const item = getWorkRow(db, workId);
  if (!item) return DROPPED;
  if (questions.length > 0 && item.status !== 'draft') {
    throw new Error('Interview questions are only for draft work');
  }
  if (sessionId) insertSession(db, { sessionId, workId, status: 'picked_up', createdAt: isoNow() });
  if (questions.length === 0) {
    const queued = promoteToQueue(db, workId)!;
    hub.emit('work.changed', workId);
    return { done: true, item: queued };
  }
  if (hub.interviewing.has(workId)) throw new Error('Interview already in progress for this draft');
  replaceWorkQuestions(db, workId, questions);
  const waiting = hub.waitForAnswers(workId);
  hub.emit('work.changed', workId);
  const answers = await waiting;
  const latest = getWorkRow(db, workId);
  if (!latest) return DROPPED;
  if (latest.status === 'queued') return { done: true, item: latest };
  return { done: false, item: latest, answers };
}
