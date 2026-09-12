/** Mutable ACP session bag shared by transport helpers and harnesses. */

import type { AgentFileChangeEvent } from './lifecycle.js';
import type { AcpSessionTransport } from './acp-session-transport.js';

export type AfterAcpSessionEstablished = (args: {
  sessionId: string;
  transport: AcpSessionTransport;
  ctx: AcpSessionContext;
  configOptions: unknown[] | null;
  modes: unknown;
}) => Promise<void>;

export type SuppressLoadReplayRef = { value: boolean };

export type OnAcpSessionEstablished = (info: {
  acpSessionId: string;
  configOptions: unknown[] | null;
  modes: unknown;
}) => void;

export type OnAcpConfigOptionsUpdated = (configOptions: unknown[]) => void;
export type OnAcpAvailableCommandsUpdated = (availableCommands: unknown[]) => void;

export type AcpSessionContext = {
  /** ACP session id once established (also used for local plan files). */
  acpSessionId?: string | null;
  cwd: string;
  onFileChange?: (evt: AgentFileChangeEvent) => void;
  mcpServers: unknown[];
  persistedAcpSessionId: string | null | undefined;
  agentLabel: string;
  suppressLoadReplay: SuppressLoadReplayRef;
  backendAgentType: string | null;
  agentConfig: Record<string, unknown> | null | undefined;
  getActiveConfigOptions?: () => unknown[] | null;
  onAcpSessionEstablished?: OnAcpSessionEstablished;
  onAcpConfigOptionsUpdated?: OnAcpConfigOptionsUpdated;
  onAcpAvailableCommandsUpdated?: OnAcpAvailableCommandsUpdated;
  logDebug: (line: string) => void;
  getStderrText: () => string;
  agentPromptImageSupported?: boolean;
  pendingPlanExecute?: { value: boolean };
  afterSessionEstablished?: AfterAcpSessionEstablished;
};
