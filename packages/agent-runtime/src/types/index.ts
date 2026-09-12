/**
 * Public plugin contracts.
 *
 * Every plugin factory takes `{ options, hooks, implementation, runtime }`.
 */

export type { LogFn } from './log.js';
export type {
  PluginKind,
  PluginRuntimeContext,
  PluginInit,
  PluginFactory,
  AgentRuntimePlugin,
} from './plugin.js';

export type { HarnessOptions } from './harness/options.js';
export type { HarnessHooks } from './harness/hooks.js';
export type { HarnessImplementation } from './harness/implementation.js';
export type { AgentInstallContext, HarnessHostImplementation } from './harness/host.js';
export type { HarnessPlugin, HarnessPluginFactory, HarnessPluginInit } from './harness/plugin.js';

export type {
  SessionStatus,
  SessionRecord,
  SessionEvent,
  LaunchAgentParams,
  SessionSnapshot,
  SessionStatusResult,
  SessionListener,
} from './session/records.js';
export type { SessionImplementation } from './session/implementation.js';
export type { SessionHooks } from './session/hooks.js';
export type { DiskSessionOptions, StreamSessionOptions, SessionBackendKind } from './session/options.js';
export type { SessionPlugin, SessionPluginFactory, SessionPluginInit } from './session/plugin.js';

export type { TransportImplementation, CommandHost } from './transport/implementation.js';
export type { TransportHooks } from './transport/hooks.js';
export type {
  TransportKind,
  McpTransportOptions,
  RemoteTransportOptions,
  RemoteCommand,
  RemoteTransportImplementation,
} from './transport/options.js';
export type { TransportPlugin, TransportPluginFactory, TransportPluginInit } from './transport/plugin.js';

export type { McpToolInputSchema, McpToolDefinition, McpToolCallResult } from './tools/definitions.js';
export type { ToolsImplementation, ToolContext, ToolRegistry } from './tools/implementation.js';
export type { ToolsHooks, PermissionRequest } from './tools/hooks.js';
export type { SubagentToolsOptions } from './tools/options.js';
export type { ToolsPlugin, ToolsPluginFactory, ToolsPluginInit } from './tools/plugin.js';
