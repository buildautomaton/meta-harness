/** ACP engine for prompting, harnesses, and ACP subprocesses. */

import type { ReportAgentCapabilitiesFn } from '@runtime/acp/capability-types.js';
import type { DiscoveredAgent } from '@runtime/harnesses/discovery-types.js';
import type { LogFn } from '@/types/log.js';
import type { AgentHarness } from '@runtime/harnesses/types.js';
import type { PromptImagePayload } from '@runtime/acp/client-types.js';
import type { AgentCapabilities } from '@runtime/acp/capability-types.js';
import type { HarnessHooks } from '@/types/harness/hooks.js';
import type { HarnessHostImplementation } from '@/types/harness/host.js';

export type ClientHostHooks = HarnessHooks & HarnessHostImplementation;

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

export type AcpEngineOptions = {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  /** Host hooks used when acquiring (spawning/resuming) an ACP client. */
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  /** Override ACP initialize clientInfo (defaults to generic agent-runtime). */
  clientInfo?: { name: string; version: string };
};

export type AcpEngine = {
  registerHarness(harness: AgentHarness): void;
  getHarness(agentType: string | null | undefined): AgentHarness | undefined;
  listHarnesses(): readonly AgentHarness[];
  discoverAgents(): Promise<DiscoveredAgent[]>;
  probeCapabilities(
    agentType: string,
    opts?: { cwd?: string; signal?: AbortSignal },
  ): Promise<AgentCapabilities | null>;
  setPreferredHarnessType(agentType: string): void;
  prompt(options: AgentPromptOptions): void;
  cancelRun(runId: string): Promise<boolean>;
  isRegisteredRun(runId: string): boolean;
  resolveRequest(requestId: string, result: unknown): void;
  disconnect(): Promise<void>;
};
