/** ACP client handle and spawn options (host-agnostic). */

import type { AfterAcpSessionEstablished } from './session-context.js';
import type { AgentFileChangeEvent } from './lifecycle.js';

export type PromptImagePayload = { mimeType: string; dataBase64: string };

export type SendPromptOptions = {
  images?: PromptImagePayload[];
};

export type PromptResult = {
  success: boolean;
  stopReason?: string;
  output?: string;
  error?: string;
};

export type AcpClientOptions = {
  command: string[];
  signal?: AbortSignal;
  sessionMode?: string;
  agentConfig?: Record<string, unknown> | null;
  killSubprocessAfterCancelMs?: number;
  onAgentSubprocessExit?: (info: { code: number | null; signal: NodeJS.Signals | null }) => void;
  backendAgentType?: string | null;
  cwd?: string;
  /**
   * Opaque host scope for isolating subprocesses (e.g. one logical app session).
   * Not an ACP session id; mapping to cloud/app ids stays outside this package.
   */
  scopeId?: string | null;
  mcpServers?: unknown[];
  persistedAcpSessionId?: string | null;
  onAcpSessionEstablished?: (info: {
    acpSessionId: string;
    configOptions: unknown[] | null;
    modes: unknown;
  }) => void;
  onAcpConfigOptionsUpdated?: (configOptions: unknown[]) => void;
  onAcpAvailableCommandsUpdated?: (availableCommands: unknown[]) => void;
  getActiveConfigOptions?: () => unknown[] | null;
  onSessionUpdate?: (params: unknown) => void;
  onRequest?: (request: { requestId: string; method: string; params: Record<string, unknown> }) => void;
  onFileChange?: (evt: AgentFileChangeEvent) => void;
  afterSessionEstablished?: AfterAcpSessionEstablished;
  createExtNotificationHandler?: (opts: {
    onSessionUpdate?: (params: unknown) => void;
  }) => (method: string, params: unknown) => Promise<void>;
  /** JSON-RPC initialize clientInfo override. */
  clientInfo?: { name: string; version: string };
};

export type AcpClientHandle = {
  sessionId: string;
  sendPrompt(prompt: string, options?: SendPromptOptions): Promise<PromptResult>;
  cancel?(): Promise<void>;
  resolveRequest?(requestId: string, result: unknown): void;
  disconnectGracefully(): Promise<void>;
  disconnect(): void;
};

export type AgentSessionLifecycle = {
  sendPrompt(prompt: string, options?: SendPromptOptions): Promise<PromptResult>;
  cancel(): Promise<void>;
  resolveRequest(requestId: string, result: unknown): void;
  disconnect(): Promise<void>;
};
