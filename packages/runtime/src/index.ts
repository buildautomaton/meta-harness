/**
 * Runtime — plugin kernel plus a catalog of plugins.
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
  fileStorePlugin,
  sqlStorePlugin,
  defaultSqlFile,
  createNodeFileStore,
  createSqlStore,
  runSqliteMigrations,
  diskSessionPlugin,
  streamSessionPlugin,
  createDiskBackend,
  createStreamBackend,
  createSqlSessionBackend,
  createSessionBackend,
  defaultSessionsDir,
  transcriptTail,
  httpTransportPlugin,
  createHttpTransport,
  createHttpRegistry,
  handleHttpRequest,
  createMcpSseHub,
  listenLocalhost,
  closeServer,
  HTTP_DEFAULT_HOST,
  HTTP_DEFAULT_PORT,
  HTTP_DEFAULT_WORK_ROOT,
  MCP_DEFAULT_PATH,
  normalizeHttpPath,
  joinHttpPath,
  stdioTransportPlugin,
  createStdioTransport,
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
  McpSseHub,
} from './plugins/index.js';
