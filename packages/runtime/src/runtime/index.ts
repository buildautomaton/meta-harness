// kernel
export { createRuntime } from './core/create-runtime.js';
export { runRuntime } from './core/run-runtime.js';
export { RUNTIME_VERSION } from './core/version.js';
export type { RuntimeOptions, RuntimeHandle } from './core/runtime-types.js';
export { applyPlugins } from './core/plugin-apply.js';
export { createPluginSlots } from './core/plugin-slots.js';
export type { PluginSlots } from './core/plugin-slots.js';
export { mergeToolRegistries } from './tools/merge-registries.js';

// ACP engine + wire
export { createAcpEngine } from './acp/engine/create-acp-engine.js';
export * from './acp/engine/types.js';
export type {
  AcpClientHandle,
  AcpClientOptions,
  PromptResult,
  PromptImagePayload,
  SendPromptOptions,
  AgentSessionLifecycle,
} from './acp/client-types.js';
export type { AgentCapabilities, ReportAgentCapabilitiesFn } from './acp/capability-types.js';
export type {
  AgentSessionUpdateKind,
  AgentSessionUpdateEvent,
  AgentRuntimeRequest,
  AgentFileChangeEvent,
  AgentRuntimeEvents,
} from './acp/session-kinds.js';
export type {
  AcpSessionContext,
  AfterAcpSessionEstablished,
} from './acp/session-context.js';
export type {
  AcpSessionTransport,
  AcpTextPromptPart,
  AcpImagePromptPart,
  AcpPromptContentBlock,
} from './acp/acp-session-transport.js';

// harness catalog (registry / discovery / install)
export { createHarnessRegistry } from './harnesses/create-registry.js';
export type { AgentHarness, AgentHarnessRegistry, GetAgentHarnessFn } from './harnesses/types.js';
export type { DiscoveredAgent, AgentDiscovery } from './harnesses/discovery-types.js';

// session + host transport helpers
export type { SessionBackend, SessionBackendWrap } from './session/types.js';
export type { HostTransport } from './transport/types.js';
