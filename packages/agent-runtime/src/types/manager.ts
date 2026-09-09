/** Top-level ACP agent runtime manager for CLI hosts. */

import type { ReportAgentCapabilitiesFn } from './capabilities.js';
import type { DiscoveredAgent } from './discovery.js';
import type { LogFn } from './log.js';
import type { AgentProvider } from './provider.js';
import type { PromptImagePayload } from './client.js';
import type { AgentCapabilities } from './capabilities.js';

export type AgentPromptAttachmentRef = {
  attachmentId: string;
  mimeType?: string;
  fileName?: string;
};

export type AgentPromptResult = {
  success: boolean;
  stopReason?: string;
  output?: string;
  error?: string;
  runId?: string;
  /** Host logical session id (opaque to this package). */
  sessionId?: string;
  promptId?: string;
};

export type AgentPromptOptions = {
  promptText: string;
  promptId?: string;
  /** Opaque host session id for routing updates (not the ACP session id). */
  sessionId?: string;
  runId?: string;
  mode?: string;
  agentType?: string;
  agentId?: string | null;
  agentConfig?: Record<string, unknown>;
  cwd?: string;
  /**
   * Opaque isolation key for ACP subprocesses (host maps cloud/app sessions here).
   * Defaults to sessionId when omitted.
   */
  scopeId?: string;
  attachments?: AgentPromptAttachmentRef[];
  images?: PromptImagePayload[];
  isNewSession?: boolean;
  sendResult: (result: AgentPromptResult) => void;
  sendSessionUpdate: (payload: unknown) => void;
  sendRequest?: (payload: unknown) => void;
};

export type AgentRuntimeManagerOptions = {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  /** Host hooks used when acquiring (spawning/resuming) an ACP client. */
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  /** Override ACP initialize clientInfo (defaults to generic agent-runtime). */
  clientInfo?: { name: string; version: string };
};

/**
 * Host-injected hooks for ACP client lifecycle: MCP servers, session persistence,
 * and live session/request/file-change callbacks.
 */
export type ClientHostHooks = {
  buildMcpServers?: (opts: { accessPort?: number | null }) => unknown[];
  getAccessPort?: () => number | null;
  /** Persist/resume by host scope id (host stores any cloud mapping outside). */
  readPersistedSession?: (scopeId: string) => {
    acpSessionId: string | null;
    configOptions: unknown[] | null;
  } | null;
  writePersistedSession?: (info: {
    scopeId: string;
    acpSessionId: string;
    configOptions: unknown[] | null;
    modes: unknown;
  }) => void;
  persistAvailableCommands?: (info: {
    scopeId: string;
    availableCommands: unknown[];
  }) => void;
  buildSessionCallbacks?: (ctx: {
    resolveRouting: () => { sessionId?: string; runId?: string } | undefined;
    sendSessionUpdate: (payload: unknown) => void;
    sendRequest: (payload: unknown) => void;
    getAgentConfig: () => Record<string, unknown> | null;
    log: LogFn;
  }) => {
    onSessionUpdate?: (params: unknown) => void;
    onRequest?: (request: { requestId: string; method: string; params: Record<string, unknown> }) => void;
    onFileChange?: (evt: {
      path: string;
      oldText: string;
      newText: string;
      patchContent: string;
    }) => void;
  };
};

export type AgentRuntimeManager = {
  registerProvider(provider: AgentProvider): void;
  getProvider(agentType: string): AgentProvider | undefined;
  listProviders(): readonly AgentProvider[];
  discoverAgents(): Promise<DiscoveredAgent[]>;
  probeCapabilities(
    agentType: string,
    opts?: { cwd?: string; signal?: AbortSignal },
  ): Promise<AgentCapabilities | null>;
  setPreferredAgentType(agentType: string): void;
  prompt(options: AgentPromptOptions): void;
  cancelRun(runId: string): Promise<boolean>;
  isRegisteredRun(runId: string): boolean;
  resolveRequest(requestId: string, result: unknown): void;
  disconnect(): Promise<void>;
};
