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
  MCP_DEFAULT_HOST,
  MCP_DEFAULT_PORT,
  MCP_DEFAULT_PATH,
  normalizeMcpPath,
  remoteTransportPlugin,
  createRemoteTransport,
  createHttpRemoteAdapter,
  minionToolsPlugin,
  CORE_TOOL_DEFINITIONS,
  SPAWN_MINION_TOOL,
  AWAIT_MINION_TOOL,
  GET_MINION_TOOL,
  GET_MINION_TRANSCRIPT_TOOL,
  GET_MINION_CONTEXT_TOOL,
  RESOLVE_MINION_REQUEST_TOOL,
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
