import type { WorkEvent, WorkListener } from '@/types/work/events.js';
import type { InterviewAnswer } from '@/types/work/interview.js';
import { isoNow } from './rank.js';

export type WorkHub = {
  emit(type: WorkEvent['type'], id?: string): void;
  subscribe(listener: WorkListener): () => void;
  waitForAnswers(workId: string): Promise<InterviewAnswer[]>;
  resolveAnswers(workId: string, answers: InterviewAnswer[]): void;
  interviewing: Set<string>;
};

export function createWorkHub(): WorkHub {
  const listeners = new Set<WorkListener>();
  const waiters = new Map<string, (answers: InterviewAnswer[]) => void>();
  const interviewing = new Set<string>();
  return {
    interviewing,
    emit(type, id) {
      const event: WorkEvent = { type, id, at: isoNow() };
      for (const listener of listeners) listener(event);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    waitForAnswers(workId) {
      interviewing.add(workId);
      return new Promise((resolve) => {
        waiters.set(workId, resolve);
      });
    },
    resolveAnswers(workId, answers) {
      interviewing.delete(workId);
      const resolve = waiters.get(workId);
      waiters.delete(workId);
      resolve?.(answers);
    },
  };
}
