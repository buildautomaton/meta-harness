// coreSet + harness catalog
export { coreSet } from './core-set.js';
export type { CoreSetOptions } from './core-set.js';
export type { CoreSetHooks } from './core-set-hooks.js';
export type { CoreSetImplementation } from './core-set-implementation.js';
export {
  coreHarnessPlugins,
  cursorHarnessPlugin,
  codexHarnessPlugin,
  kiroHarnessPlugin,
  claudeCodeHarnessPlugin,
  opencodeHarnessPlugin,
} from './harnesses/plugins.js';
export { BUILTIN_HARNESSES } from './harnesses/builtins.js';

// stores
export { fileStorePlugin } from './stores/file/plugin.js';
export { sqlStorePlugin, defaultSqlFile } from './stores/sql/plugin.js';
export { createNodeFileStore } from './stores/file/store.js';
export { createSqlStore } from './stores/sql/store.js';
export { runSqliteMigrations } from './stores/sql/migrate.js';

// session
export { diskSessionPlugin } from './session/disk/plugin.js';
export { streamSessionPlugin } from './session/stream/plugin.js';
export { createDiskBackend } from './session/disk/backend.js';
export { createStreamBackend } from './session/stream/backend.js';
export { createSqlSessionBackend } from './session/sql/backend.js';
export { createSessionBackend, defaultSessionsDir } from './session/create-backend.js';
export { transcriptTail } from './session/transcript.js';

// transport
export { httpTransportPlugin } from './transport/http/plugin.js';
export { createHttpTransport } from './transport/http/transport.js';
export { createHttpRegistry } from './transport/http/registry.js';
export { handleHttpRequest } from './transport/http/http-handler.js';
export { createMcpSseHub } from './transport/http/sse-hub.js';
export type { McpSseHub } from './transport/http/sse-hub.js';
export { listenLocalhost, closeServer } from './transport/http/http-listen.js';
export {
  HTTP_DEFAULT_HOST,
  HTTP_DEFAULT_PORT,
  HTTP_DEFAULT_WORK_ROOT,
  MCP_DEFAULT_PATH,
  normalizeHttpPath,
  joinHttpPath,
} from './transport/http/http-path.js';
export { stdioTransportPlugin } from './transport/stdio/plugin.js';
export { createStdioTransport } from './transport/stdio/transport.js';
export { remoteTransportPlugin } from './transport/remote/plugin.js';
export { createRemoteTransport } from './transport/remote/transport.js';
export { createHttpRemoteAdapter } from './transport/remote/http-adapter.js';

// minion tools
export { minionToolsPlugin } from './tools/minion/plugin.js';
export { CORE_TOOL_DEFINITIONS } from './tools/minion/definitions.js';
export {
  SPAWN_MINION_TOOL,
  AWAIT_MINION_TOOL,
  GET_MINION_TOOL,
  GET_MINION_TRANSCRIPT_TOOL,
  GET_MINION_CONTEXT_TOOL,
  RESOLVE_MINION_REQUEST_TOOL,
} from './tools/minion/names.js';
export { jsonToolResult } from './tools/minion/json-result.js';
export { createCoreToolRegistry } from './tools/minion/core-registry.js';
export { launchSession } from './tools/minion/launch-session.js';
export { getSessionStatus } from './tools/minion/session-status.js';
