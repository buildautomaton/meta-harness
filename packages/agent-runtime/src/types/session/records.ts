import type { MinionPendingRequest } from '../notify.js';
import type { SessionLogEntry } from './log.js';

export type SessionStatus = 'running' | 'completed' | 'failed';

export type SessionRecord = {
  id: string;
  harness: string;
  model?: string;
  prompt: string;
  cwd: string;
  status: SessionStatus;
  runId: string;
  acpSessionId?: string | null;
  createdAt: string;
  updatedAt: string;
  error?: string;
  transcript?: string;
  log?: SessionLogEntry[];
};

export type SessionEvent = {
  ts: string;
  kind: 'update' | 'request' | 'file_change' | 'result';
  payload: unknown;
};

export type LaunchAgentParams = {
  harness: string;
  prompt: string;
  model?: string;
  cwd?: string;
};

export type SessionSnapshot = {
  session: SessionRecord;
  events: SessionEvent[];
};

export type SessionStatusResult = {
  minionId: string;
  status: SessionStatus;
  harness: string;
  model?: string;
  cwd?: string;
  error?: string;
  authRequired?: boolean;
  authEnvVar?: string;
  pendingRequests: MinionPendingRequest[];
  needsUser?: boolean;
  transcript: string;
  summary: string;
};

export type SessionListener = (event: SessionEvent, snapshot: SessionSnapshot) => void;
