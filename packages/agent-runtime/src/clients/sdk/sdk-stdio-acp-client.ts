/**
 * ACP over stdio via `@agentclientprotocol/sdk` (`ClientSideConnection` + ndJsonStream).
 * Used by Codex, Claude ACP, and Kiro. Cursor uses `providers/cursor/` instead.
 */

import { getDefaultAgentCwd } from '../../util/cwd.js';
import {
  formatJsonRpcStyleError,
  mergeErrorWithStderr,
} from '../agent-stderr-capture.js';
import type { AcpClientHandle, AcpClientOptions } from '../acp-client.js';
import { formatSpawnError } from '../format-spawn-error.js';
import { createSdkStdioHandle } from './create-sdk-stdio-handle.js';
import { createSdkStdioSessionContext } from './create-sdk-stdio-session-context.js';
import { bootstrapSdkStdioConnection } from './sdk-stdio-bootstrap-connection.js';
import { createSdkStdioInitSettle } from './sdk-stdio-init-settle.js';
import { attachSdkStdioStderrAuthWatch } from './sdk-stdio-stderr-auth-watch.js';
import { spawnSdkStdioProcess } from './spawn-sdk-stdio-process.js';
import { listenForAcpClientAbort } from '../listen-for-acp-client-abort.js';
import { yieldToEventLoop } from '../../util/yield-to-event-loop.js';
import type { SdkStdioPermissionPendingEntry } from './sdk-stdio-permission-pending.js';

export async function createSdkStdioAcpClient(options: AcpClientOptions): Promise<AcpClientHandle> {
  const { PROTOCOL_VERSION } = await import('@agentclientprotocol/sdk');
  const {
    command,
    cwd = getDefaultAgentCwd(),
    backendAgentType,
    onSessionUpdate,
    onRequest,
    onFileChange,
    killSubprocessAfterCancelMs,
    onAgentSubprocessExit,
    agentConfig,
    persistedAcpSessionId,
    onAcpSessionEstablished,
    onAcpConfigOptionsUpdated,
    getActiveConfigOptions,
    afterSessionEstablished,
    createExtNotificationHandler,
    signal,
  } = options;

  if (signal?.aborted) {
    throw new Error('ACP client aborted');
  }

  const { child, stderrCapture } = spawnSdkStdioProcess({
    command,
    cwd,
    onAgentSubprocessExit,
  });
  await yieldToEventLoop();

  const sessionCtx = createSdkStdioSessionContext({
    cwd,
    mcpServers: options.mcpServers,
    persistedAcpSessionId,
    backendAgentType,
    agentConfig,
    getActiveConfigOptions,
    onAcpSessionEstablished,
    onAcpConfigOptionsUpdated,
    onAcpAvailableCommandsUpdated: options.onAcpAvailableCommandsUpdated,
    onFileChange,
    afterSessionEstablished,
    stderrCapture,
  });

  return new Promise<AcpClientHandle>((resolve, reject) => {
    const init = createSdkStdioInitSettle(child);
    const stopAbort = listenForAcpClientAbort(child, signal, () => {
      init.settleReject(reject, new Error('ACP client aborted'));
    });

    child.on('error', (err: NodeJS.ErrnoException) => {
      stopAbort();
      init.settleReject(reject, new Error(formatSpawnError(err, command[0])));
    });

    attachSdkStdioStderrAuthWatch({
      child,
      stderrCapture,
      backendAgentType,
      init,
      reject,
    });

    void (async () => {
      try {
        const pendingPermissionReplies = new Map<string, SdkStdioPermissionPendingEntry>();
        const { transport, established } = await bootstrapSdkStdioConnection({
          child,
          sessionCtx,
          backendAgentType,
          onSessionUpdate,
          onRequest,
          pendingPermissionReplies,
          protocolVersion: PROTOCOL_VERSION,
          createExtNotificationHandler,
        });

        init.settleResolve(
          resolve,
          createSdkStdioHandle({
            child,
            sessionId: established.sessionId,
            sessionCtx,
            transport,
            pendingPermissionReplies,
            killSubprocessAfterCancelMs,
          }),
        );
        stopAbort();
      } catch (err) {
        stopAbort();
        if (init.settled) return;
        init.settleReject(
          reject,
          new Error(mergeErrorWithStderr(formatJsonRpcStyleError(err), stderrCapture.getText())),
        );
      }
    })();
  });
}
