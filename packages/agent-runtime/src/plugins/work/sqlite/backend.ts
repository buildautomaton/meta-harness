import type { WorkImplementation } from '@/types/work/implementation.js';
import type { OpenedDb } from './open-db.js';
import { openSqlite } from './open-db.js';
import { listWorkRows, getWorkRow } from './read-work.js';
import { insertWork } from './insert-work.js';
import { patchWork } from './patch-work.js';
import { pickNext } from './pick-next.js';
import { insertSession, completeSessionRow, listSessionRows } from './sessions.js';
import { recordSubmission } from './record-submission.js';
import { listArtifactSummaries, loadArtifact } from './artifacts.js';
import { saveAnswers } from './answers.js';
import { isoNow } from './rank.js';

export function createSqliteWorkBackend(file?: string): WorkImplementation {
  let opened: OpenedDb | undefined;
  const dbp = () => (opened ??= openSqlite(file));
  const withDb = async <T>(fn: (opened: OpenedDb) => T): Promise<T> => Promise.resolve(fn(dbp()));
  return composeBackend(withDb);
}

function composeBackend(
  withDb: <T>(fn: (opened: OpenedDb) => T) => Promise<T>,
): WorkImplementation {
  return {
    listWork: (opts) => withDb(({ db }) => listWorkRows(db, opts?.status)),
    getWork: (id) => withDb(({ db }) => getWorkRow(db, id)),
    addWork: (input) => withDb(({ db }) => insertWork(db, input)),
    updateWork: (id, patch) => withDb(({ db }) => patchWork(db, id, patch)),
    pickNextWork: (sessionId) => withDb(({ db }) => pickNext(db, sessionId)),
    attachSession: (workId, sessionId) =>
      withDb(({ db }) => insertSession(db, { sessionId, workId, status: 'picked_up', createdAt: isoNow() })),
    completeSession: (sessionId, artifactId) =>
      withDb(({ db }) => completeSessionRow(db, sessionId, artifactId)),
    listSessions: (workId) => withDb(({ db }) => listSessionRows(db, workId)),
    recordSubmission: (input) => withDb(({ db }) => recordSubmission(db, input)),
    listArtifacts: (workId) => withDb(({ db }) => listArtifactSummaries(db, workId)),
    getArtifact: (id) => withDb(({ db }) => loadArtifact(db, id)),
    answerQuestions: (artifactId, answers) => withDb(({ db }) => saveAnswers(db, artifactId, answers)),
  };
}
