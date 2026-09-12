/**
 * ACP agent runtime — plugin kernel plus a catalog of plugins.
 */

export * from './types/index.js';
export * from './runtime/index.js';
export {
  coreSet,
  coreHarnessPlugins,
  cursorHarnessPlugin,
  codexHarnessPlugin,
  kiroHarnessPlugin,
  claudeCodeHarnessPlugin,
  opencodeHarnessPlugin,
  BUILTIN_HARNESSES,
  diskSessionPlugin,
  streamSessionPlugin,
  createDiskBackend,
  createStreamBackend,
  createSessionBackend,
  defaultSessionsDir,
  transcriptTail,
  mcpTransportPlugin,
  createMcpTransport,
  remoteTransportPlugin,
  createRemoteTransport,
  createHttpRemoteAdapter,
  subagentToolsPlugin,
  CORE_TOOL_DEFINITIONS,
  LAUNCH_SUBAGENT_TOOL,
  GET_SESSION_TOOL,
  jsonToolResult,
  createCoreToolRegistry,
  launchSession,
  getSessionStatus,
} from './plugins/index.js';
export type {
  CoreSetOptions,
  CoreSetHooks,
  CoreSetImplementation,
} from './plugins/index.js';
