import type { SqlStore } from '@buildautomaton/runtime';
import type { WorkImplementation } from '@/types/work/implementation.js';
import type { WorkHub } from './hub.js';
import { listWorkRows, getWorkRow } from './read-work.js';
import { insertWork } from './insert-work.js';
import { pickNext } from './pick-next.js';
import { insertSession, completeSessionRow, listSessionRows } from './sessions.js';
import type { ArtifactKind } from '@/types/artifact/kind.js';
import { recordSubmission } from './record-submission.js';
import { listArtifactSummaries, loadArtifact } from './artifacts.js';
import { saveAnswers } from './answers.js';
import { isoNow } from './rank.js';
import { answerDraftQuestions } from './answer-draft.js';
import { submitInterview } from './submit-interview.js';
import { saveAssetRow, listAssetRows } from './assets.js';
import { deleteDraft } from './delete-draft.js';
import { updateWorkRow } from './update-work.js';
import { renameProject as renameProjectRows } from './rename-project.js';
import { setArtifactProject } from './set-artifact-project.js';

export function sqliteMethods(
  withDb: <T>(fn: (db: SqlStore) => T | Promise<T>) => Promise<T>,
  hub: WorkHub,
  artifacts: ArtifactKind[] = [],
): WorkImplementation {
  const emit = (type: Parameters<WorkHub['emit']>[0], id?: string) => hub.emit(type, id);
  return {
    listWork: (opts) => withDb((db) => listWorkRows(db, opts?.status)),
    getWork: (id) => withDb((db) => getWorkRow(db, id)),
    addWork: (input) =>
      withDb((db) => {
        const item = insertWork(db, input);
        emit('work.changed', item.id);
        return item;
      }),
    updateWork: (id, patch) =>
      withDb((db) => {
        const item = updateWorkRow(db, hub, id, patch);
        if (item || patch.unqueue) emit('work.changed', id);
        return item;
      }),
    renameProject: (from, to) =>
      withDb((db) => {
        renameProjectRows(db, from, to);
        emit('work.changed');
        emit('artifact.changed');
      }),
    deleteWork: (id) =>
      withDb((db) => {
        const deleted = deleteDraft(db, hub, id);
        if (deleted) emit('work.changed', id);
        return deleted;
      }),
    pickNextWork: (sessionId) =>
      withDb((db) => {
        const item = pickNext(db, sessionId);
        if (item) emit('work.changed', item.id);
        return item;
      }),
    attachSession: (workId, sessionId) =>
      withDb((db) => insertSession(db, { sessionId, workId, status: 'picked_up', createdAt: isoNow() })),
    completeSession: (sessionId, artifactId) =>
      withDb((db) => {
        completeSessionRow(db, sessionId, artifactId);
        emit('work.changed');
        emit('artifact.changed', artifactId);
      }),
    listSessions: (workId) => withDb((db) => listSessionRows(db, workId)),
    recordSubmission: (input) =>
      withDb((db) => {
        const artifact = recordSubmission(db, input, artifacts);
        emit('artifact.changed', artifact.id);
        return artifact;
      }),
    listArtifacts: (workId) => withDb((db) => listArtifactSummaries(db, workId)),
    getArtifact: (id) => withDb((db) => loadArtifact(db, id)),
    updateArtifact: (id, patch) =>
      withDb((db) => {
        const artifact = setArtifactProject(db, id, patch.project);
        if (artifact) emit('artifact.changed', id);
        return artifact;
      }),
    answerQuestions: (artifactId, answers) =>
      withDb((db) => {
        const result = saveAnswers(db, artifactId, answers);
        emit('answers.changed', artifactId);
        for (const item of result.queued) emit('work.changed', item.id);
        for (const id of result.removed) emit('work.changed', id);
        return result;
      }),
    answerWorkQuestions: (workId, answers) => withDb((db) => answerDraftQuestions(db, hub, workId, answers)),
    submitInterview: (workId, questions, sessionId) =>
      withDb((db) => submitInterview(db, hub, workId, questions, sessionId)),
    saveAsset: (input) => withDb((db) => saveAssetRow(db, input)),
    listAssets: (sessionId) => withDb((db) => listAssetRows(db, sessionId)),
    subscribe: (listener) => hub.subscribe(listener),
  };
}
