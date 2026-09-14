export type SessionLogEntry = {
  type: 'message' | 'thought' | 'tool_call' | 'request' | 'result';
  text?: string;
  toolCallId?: string;
  name?: string;
  title?: string;
  kind?: string;
  input?: unknown;
  output?: unknown;
  status?: string;
  success?: boolean;
  error?: string;
};

export type SessionCompactPayload = {
  transcript: string;
  log: SessionLogEntry[];
};
