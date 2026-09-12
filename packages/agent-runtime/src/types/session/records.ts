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
  sessionId: string;
  status: SessionStatus;
  harness: string;
  model?: string;
  error?: string;
  summary: string;
};

export type SessionListener = (event: SessionEvent, snapshot: SessionSnapshot) => void;
