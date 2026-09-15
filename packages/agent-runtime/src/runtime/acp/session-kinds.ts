/**
 * Normalized ACP / vendor session-update and request kinds.
 * Planning and todos are first-class for CLI consumers.
 */

export type AgentSessionUpdateKind =
  | 'message'
  | 'tool_call'
  | 'tool_call_update'
  | 'plan'
  | 'todos'
  | 'task'
  | 'permission'
  | 'question'
  | 'config_option_update'
  | 'available_commands_update'
  | 'session_info_update'
  | 'unknown';

export type AgentSessionUpdateEvent = {
  kind: AgentSessionUpdateKind;
  payload: unknown;
  sessionId?: string;
  runId?: string;
};

export type AgentRuntimeRequest = {
  requestId: string;
  method: string;
  params: Record<string, unknown>;
  /** Normalized kind when the method maps to plan / permission / question / todos. */
  kind?: 'plan' | 'permission' | 'question' | 'todos' | 'task';
};

export type AgentFileChangeEvent = {
  path: string;
  oldText: string;
  newText: string;
  patchContent: string;
};

export type AgentRuntimeEvents = {
  onSessionUpdate?: (event: AgentSessionUpdateEvent) => void;
  onRequest?: (request: AgentRuntimeRequest) => void;
  onFileChange?: (event: AgentFileChangeEvent) => void;
};
