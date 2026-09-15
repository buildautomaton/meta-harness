import * as http from 'node:http';
import type { LogFn } from '@/types/log.js';
import type { McpTransportOptions } from '@/types/transport/options.js';
import type { HostTransport } from '@runtime/transport/types.js';
import { logToStderr } from '@plugins/transport/shared/log-to-stderr.js';
import { handleMcpHttpRequest } from './http-handler.js';
import { closeServer, listenLocalhost, waitForClose } from './http-listen.js';
import { MCP_DEFAULT_HOST, MCP_DEFAULT_PATH, MCP_DEFAULT_PORT, mcpListenUrl, normalizeMcpPath } from './http-path.js';
import { mcpNotifierSink } from './mcp-sink.js';
import { createMcpSseHub } from './sse-hub.js';

export type CreateMcpTransportInit = McpTransportOptions & {
  log?: LogFn;
  onListening?: (info: { url: string; port: number }) => void;
};

/** JSON-RPC MCP server over localhost HTTP (Streamable HTTP POST + SSE GET). */
export function createMcpTransport(init: CreateMcpTransportInit = {}): HostTransport {
  const log = init.log ?? logToStderr;
  const host = init.host ?? MCP_DEFAULT_HOST;
  const path = normalizeMcpPath(init.path ?? MCP_DEFAULT_PATH);
  const port = init.port ?? MCP_DEFAULT_PORT;
  const sse = createMcpSseHub();
  let server: http.Server | undefined;
  let unsub: (() => void) | undefined;
  return {
    id: 'mcp',
    async start(commandHost) {
      log('[MCP] Starting HTTP JSON-RPC server');
      unsub = commandHost.notifier?.subscribe(mcpNotifierSink(sse));
      const initialized = { value: false };
      server = http.createServer((req, res) => {
        void handleMcpHttpRequest(req, res, { path, tools: commandHost, initialized, log, sse });
      });
      const bound = await listenLocalhost(server, port, host);
      const names = (await commandHost.listTools()).map((t) => t.name);
      const url = mcpListenUrl(host, bound, path);
      log(`[MCP] Listening on ${url} (${names.join(', ') || 'no tools'})`);
      init.onListening?.({ url, port: bound });
      await waitForClose(server);
      log('[MCP] HTTP server closed');
    },
    async stop() {
      log('[MCP] Stopping');
      unsub?.();
      sse.close();
      await closeServer(server);
    },
  };
}
