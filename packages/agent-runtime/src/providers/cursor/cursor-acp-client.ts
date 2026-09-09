/**
 * Cursor CLI ACP over JSON-RPC stdio.
 */

import { getDefaultAgentCwd } from '../../util/cwd.js';
import {
  formatJsonRpcStyleError,
  mergeErrorWithStderr,
} from '../../clients/agent-stderr-capture.js';
import type { AcpClientHandle, AcpClientOptions } from '../../clients/acp-client.js';
import {
  installedAgentAuthProcessEnv,
  cursorAgentUsesApiKeyAuth,
} from '../../clients/installed-agent-auth-env.js';
import { formatSpawnError } from '../../clients/format-spawn-error.js';
import { killChildProcessTree } from '../../clients/kill-process-tree.js';
import { buildCursorAcpSpawnCommand } from './cursor-spawn-command.js';
import { createCursorAcpSessionContext } from './create-cursor-acp-session-context.js';
import { createCursorAcpHandle } from './create-cursor-acp-handle.js';
import { initCursorAcpWire } from './cursor-acp-init.js';
import { spawnCursorAcpProcess } from './spawn-cursor-acp-process.js';
import { listenForAcpClientAbort } from '../../clients/listen-for-acp-client-abort.js';

export { buildCursorAcpSpawnCommand } from './cursor-spawn-command.js';
export { BACKEND_LOCAL_AGENT_TYPE, detectLocalAgentPresence } from './cursor-local-agent.js';

export async function createCursorAcpClient(options: AcpClientOptions): Promise<AcpClientHandle> {
  const command = buildCursorAcpSpawnCommand(options.command, options.sessionMode);
  const {
    cwd = getDefaultAgentCwd(),
    backendAgentType,
    onSessionUpdate,
    onRequest,
    onFileChange,
    persistedAcpSessionId,
    onAcpSessionEstablished,
    onAcpConfigOptionsUpdated,
    onAgentSubprocessExit,
    afterSessionEstablished,
    signal,
  } = options;
  const dbgFs = process.env.AGENT_RUNTIME_DEBUG_ACP_FS === '1';

  const spawnEnv = installedAgentAuthProcessEnv(process.env);
  const { child, stderrCapture } = spawnCursorAcpProcess({
    command,
    cwd,
    onAgentSubprocessExit,
  });
  const skipBrowserAuthenticate = cursorAgentUsesApiKeyAuth(spawnEnv);

  const sessionCtx = createCursorAcpSessionContext({
    cwd,
    mcpServers: options.mcpServers,
    persistedAcpSessionId,
    backendAgentType,
    agentConfig: options.agentConfig,
    getActiveConfigOptions: options.getActiveConfigOptions,
    onAcpSessionEstablished,
    onAcpConfigOptionsUpdated,
    onAcpAvailableCommandsUpdated: options.onAcpAvailableCommandsUpdated,
    onFileChange,
    afterSessionEstablished,
    stderrCapture,
  });

  return new Promise<AcpClientHandle>((resolve, reject) => {
    const stopAbort = listenForAcpClientAbort(child, signal, () => {
      reject(new Error('ACP client aborted'));
    });
    child.on('error', (err: NodeJS.ErrnoException) => {
      stopAbort();
      killChildProcessTree(child, 'SIGKILL');
      reject(new Error(formatSpawnError(err, command[0])));
    });

    void (async () => {
      try {
        const { wire, transport, established, incoming, pendingRequests } = await initCursorAcpWire({
          child,
          sessionCtx,
          skipBrowserAuthenticate,
          incomingDeps: { dbgFs, sessionCtx, onSessionUpdate, onRequest },
        });
        stopAbort();
        resolve(
          createCursorAcpHandle({
            child,
            sessionId: established.sessionId,
            sessionCtx,
            transport,
            wire,
            incoming,
            pendingRequests,
          }),
        );
      } catch (err) {
        stopAbort();
        killChildProcessTree(child, 'SIGKILL');
        const merged = mergeErrorWithStderr(formatJsonRpcStyleError(err), stderrCapture.getText());
        reject(merged ? new Error(merged) : err instanceof Error ? err : new Error(String(err)));
      }
    })();
  });
}
