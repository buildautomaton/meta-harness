import * as readline from 'node:readline';
import { bootstrapAcpWireSession } from '../../clients/shared/bootstrap-acp-wire-session.js';
import { createCursorAcpIncomingLineHandler } from './cursor-acp-incoming-line-handler.js';
import { createCursorJsonRpcAcpTransport } from './cursor-json-rpc-acp-transport.js';
import { createCursorJsonRpcWriter } from './cursor-json-rpc-wire.js';
import type { JsonRpcRequestId, PendingRequest } from './cursor-json-rpc-types.js';
import type { AcpSessionContext } from '../../clients/acp-session-context.js';
import type { CursorAcpChild } from './spawn-cursor-acp-process.js';
import type { CursorAcpIncomingLineHandlerDeps } from './cursor-acp-incoming-line-handler.js';

export const CURSOR_ACP_CLIENT_INFO = {
  protocolVersion: 1 as const,
  clientCapabilities: {
    fs: { readTextFile: true, writeTextFile: true },
    terminal: false,
    prompt: { image: true },
  },
  clientInfo: { name: 'agent-runtime', version: '0.1.0' },
};

export async function initCursorAcpWire(options: {
  child: CursorAcpChild;
  sessionCtx: AcpSessionContext;
  skipBrowserAuthenticate?: boolean;
  incomingDeps: Omit<
    CursorAcpIncomingLineHandlerDeps,
    'respond' | 'respondJsonRpcError' | 'settleResponse' | 'pendingRequests'
  >;
}) {
  const wire = createCursorJsonRpcWriter(options.child.stdin);
  const pendingRequests = new Map<JsonRpcRequestId, PendingRequest>();
  const incoming = createCursorAcpIncomingLineHandler({
    ...options.incomingDeps,
    respond: wire.respond,
    respondJsonRpcError: wire.respondJsonRpcError,
    settleResponse: wire.settleResponse,
    pendingRequests,
  });

  const rl = readline.createInterface({ input: options.child.stdout });
  rl.on('line', (line) => incoming.handleLine(line));

  const transport = createCursorJsonRpcAcpTransport({
    send: wire.send,
    cancelSessionNotification: wire.cancelSessionNotification,
    skipBrowserAuthenticate: options.skipBrowserAuthenticate,
  });

  const established = await bootstrapAcpWireSession(transport, options.sessionCtx, CURSOR_ACP_CLIENT_INFO);

  return { wire, transport, established, incoming, pendingRequests };
}
