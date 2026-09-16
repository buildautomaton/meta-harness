/**
 * ACP agent runtime — plugin kernel plus a catalog of plugins.
 *
 * Map: types/ (plugin contracts) → runtime/core/ (createRuntime) →
 * runtime/acp/ (engine + wire) → runtime/harnesses/ (registry) →
 * plugins/ (coreSet + per-agent adapters). See README glossary.
 */

// kernel + ACP engine
export * from './types/index.js';
export * from './runtime/index.js';

// plugin catalog
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
  sqliteWorkPlugin,
  memoryWorkPlugin,
  defaultWorkFile,
  createSqliteWorkBackend,
  workToolsPlugin,
  WORK_TOOL_DEFINITIONS,
  ASK_WHAT_TO_WORK_ON_TOOL,
  TELL_WHAT_WAS_BUILT_TOOL,
  createWorkHttpHandler,
  buildArtifactFiles,
} from './plugins/index.js';
export type {
  CoreSetOptions,
  CoreSetHooks,
  CoreSetImplementation,
} from './plugins/index.js';
