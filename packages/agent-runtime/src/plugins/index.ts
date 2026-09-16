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

// session
export { diskSessionPlugin } from './session/disk/plugin.js';
export { streamSessionPlugin } from './session/stream/plugin.js';
export { createDiskBackend } from './session/disk/backend.js';
export { createStreamBackend } from './session/stream/backend.js';
export { createSessionBackend, defaultSessionsDir } from './session/create-backend.js';
export { transcriptTail } from './session/transcript.js';

// transport
export { mcpTransportPlugin } from './transport/mcp/plugin.js';
export { createMcpTransport } from './transport/mcp/transport.js';
export {
  MCP_DEFAULT_HOST,
  MCP_DEFAULT_PORT,
  MCP_DEFAULT_PATH,
  normalizeMcpPath,
} from './transport/mcp/http-path.js';
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

// work
export { sqliteWorkPlugin, memoryWorkPlugin, defaultWorkFile } from './work/sqlite/plugin.js';
export { createSqliteWorkBackend } from './work/sqlite/backend.js';
export { createWorkHttpHandler } from './work/http/handler.js';
export { buildArtifactFiles } from './work/artifacts/build-files.js';

// work-tools
export { workToolsPlugin } from './work-tools/plugin.js';
export { WORK_TOOL_DEFINITIONS } from './work-tools/definitions.js';
export { ASK_WHAT_TO_WORK_ON_TOOL, TELL_WHAT_WAS_BUILT_TOOL } from './work-tools/names.js';
