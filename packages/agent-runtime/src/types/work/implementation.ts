import type { AddWorkInput, WorkItem, WorkPatch, WorkSessionLink } from './records.js';
import type { DesignQuestion, QuestionAnswer } from './questions.js';
import type { WorkArtifact, WorkArtifactSummary } from './artifact.js';
import type { SubmitWorkInput } from './submit.js';
import type { InterviewRound } from './interview.js';
import type { WorkAssetInput, WorkListener } from './events.js';

export type AnswerQuestionsResult = {
  queued: WorkItem[];
  removed: string[];
};

/** Storage contract. SQLite WASM locally; HTTP/DO in the cloud. */
export type WorkImplementation = {
  listWork(opts?: { status?: WorkItem['status'] }): Promise<WorkItem[]>;
  getWork(id: string): Promise<WorkItem | null>;
  addWork(input: AddWorkInput): Promise<WorkItem>;
  updateWork(id: string, patch: WorkPatch): Promise<WorkItem | null>;
  pickNextWork(sessionId: string): Promise<WorkItem | null>;
  attachSession(workId: string, sessionId: string): Promise<WorkSessionLink>;
  completeSession(sessionId: string, artifactId: string): Promise<void>;
  listSessions(workId: string): Promise<WorkSessionLink[]>;
  recordSubmission(input: SubmitWorkInput): Promise<WorkArtifact>;
  listArtifacts(workId?: string): Promise<WorkArtifactSummary[]>;
  getArtifact(id: string): Promise<WorkArtifact | null>;
  answerQuestions(artifactId: string, answers: QuestionAnswer[]): Promise<AnswerQuestionsResult>;
  answerWorkQuestions(workId: string, answers: QuestionAnswer[]): Promise<WorkItem | null>;
  submitInterview(workId: string, questions: DesignQuestion[], sessionId?: string): Promise<InterviewRound>;
  saveAsset(input: WorkAssetInput): Promise<WorkAssetInput>;
  listAssets(sessionId: string): Promise<WorkAssetInput[]>;
  subscribe(listener: WorkListener): () => void;
};

export type WorkBackend = WorkImplementation & { id: string };
export type WorkBackendWrap = (base: WorkImplementation) => WorkImplementation;
