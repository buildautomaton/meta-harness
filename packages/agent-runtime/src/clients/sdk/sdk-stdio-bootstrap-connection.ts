import { Readable, Writable } from 'node:stream';
import { killChildProcessTree } from '../kill-process-tree.js';
import { bootstrapAcpWireSession } from '../shared/bootstrap-acp-wire-session.js';
import type { AcpClientOptions } from '../acp-client.js';
import type { AcpSessionContext } from '../acp-session-context.js';
import { createSdkAcpSessionTransport } from './sdk-acp-session-transport.js';
import { createSdkStdioConnectionClient } from './sdk-stdio-connection-client.js';
import type { SdkStdioPermissionPendingEntry } from './sdk-stdio-permission-pending.js';
import type { SdkStdioChild } from './spawn-sdk-stdio-process.js';

export const SDK_STDIO_CLIENT_INFO = {
  clientCapabilities: {
    fs: { readTextFile: true, writeTextFile: true },
    prompt: { image: true },
  },
  clientInfo: { name: 'agent-runtime', version: '0.1.0' },
};

export async function bootstrapSdkStdioConnection(options: {
  child: SdkStdioChild;
  sessionCtx: AcpSessionContext;
  backendAgentType?: string | null;
  onSessionUpdate?: AcpClientOptions['onSessionUpdate'];
  onRequest?: AcpClientOptions['onRequest'];
  pendingPermissionReplies: Map<string, SdkStdioPermissionPendingEntry>;
  protocolVersion: number;
  createExtNotificationHandler?: AcpClientOptions['createExtNotificationHandler'];
}) {
  const { ClientSideConnection, ndJsonStream } = await import('@agentclientprotocol/sdk');

  const writable = Writable.toWeb(options.child.stdin) as WritableStream;
  const readable = Readable.toWeb(options.child.stdout) as ReadableStream<Uint8Array>;
  const stream = ndJsonStream(writable, readable);

  const client = createSdkStdioConnectionClient({
    backendAgentType: options.backendAgentType,
    onSessionUpdate: options.onSessionUpdate,
    onRequest: options.onRequest,
    sessionCtx: options.sessionCtx,
    pendingPermissionReplies: options.pendingPermissionReplies,
    createExtNotificationHandler: options.createExtNotificationHandler,
  });
  const connection = new ClientSideConnection(client as any, stream);

  connection.signal.addEventListener('abort', () => {
    killChildProcessTree(options.child, 'SIGKILL');
  });

  const transport = createSdkAcpSessionTransport(connection);
  const established = await bootstrapAcpWireSession(transport, options.sessionCtx, {
    protocolVersion: options.protocolVersion,
    ...SDK_STDIO_CLIENT_INFO,
  });

  return { transport, established };
}
