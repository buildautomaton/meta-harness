/**
 * One prompt turn. `engine.prompt` is fire-and-forget; completion is `sendResult`.
 * MCP/remote transport never calls this — minion tools (or a host) call `engine.prompt`.
 *
 * handlePrompt
 *   → resolvePromptRunContext   runId, keys, register run
 *   → runPrompt
 *       → acquirePromptClient   reuse or spawnAcpClient via harness.createClient
 *       → dispatchPrompt        handle.sendPrompt (ACP session/prompt)
 *
 * Live updates: sendSessionUpdate / sendRequest (also fan out to plugin hostHooks).
 */
export { handlePrompt } from './handle-prompt.js';
export { runPrompt } from './run-prompt.js';
export { acquirePromptClient } from './acquire-prompt-client.js';
export { dispatchPrompt } from './dispatch-prompt.js';
