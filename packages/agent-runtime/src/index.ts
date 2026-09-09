/**
 * ACP agent runtime — single public entrypoint.
 *
 * Everything else lives under subdirectories and is reached through the manager.
 */

export { createAgentRuntimeManager } from './manager/create-agent-runtime-manager.js';

export type {
  AgentRuntimeManager,
  AgentRuntimeManagerOptions,
  AgentPromptOptions,
  AgentPromptResult,
  AgentPromptAttachmentRef,
  ClientHostHooks,
  AgentProvider,
  AgentProviderInstall,
  AgentInstallContext,
  AgentProviderRegistry,
  DiscoveredAgent,
  AgentDiscovery,
  AgentCapabilities,
  ReportAgentCapabilitiesFn,
  AgentSessionUpdateKind,
  AgentSessionUpdateEvent,
  AgentRuntimeRequest,
  AgentFileChangeEvent,
  AgentRuntimeEvents,
  AcpClientOptions,
  AcpClientHandle,
  PromptResult,
  PromptImagePayload,
  SendPromptOptions,
  AgentSessionLifecycle,
  AcpSessionContext,
  AcpSessionTransport,
  AfterAcpSessionEstablished,
  LogFn,
} from './types/index.js';
