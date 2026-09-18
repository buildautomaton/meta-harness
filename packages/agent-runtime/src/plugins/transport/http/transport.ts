import * as http from 'node:http';
import type { LogFn } from '@/types/log.js';
import type { HttpTransportOptions } from '@/types/transport/options.js';
import type { HttpRegistry } from '@/types/http/registry.js';
import type { HostTransport } from '@runtime/transport/types.js';
import { logToStderr } from '@plugins/transport/shared/log-to-stderr.js';
import { handleHttpRequest } from './http-handler.js';
import { closeServer, listenLocalhost, waitForClose } from './http-listen.js';
import { HTTP_DEFAULT_HOST, HTTP_DEFAULT_PORT, MCP_DEFAULT_PATH, httpListenUrl, normalizeHttpPath } from './http-path.js';
import { mcpNotifierSink } from './mcp-sink.js';
import { createMcpSseHub } from './sse-hub.js';
import { attachHttpWebSockets } from './bind-ws.js';
import { createHttpRegistry } from './registry.js';

export type CreateHttpTransportInit = HttpTransportOptions & {
  log?: LogFn;
  registry?: HttpRegistry;
  onListening?: (info: { url: string; port: number }) => void;
};

/** Shared HTTP server: MCP tools plus routes/websockets from other plugins. */
export function createHttpTransport(init: CreateHttpTransportInit = {}): HostTransport {
  const log = init.log ?? logToStderr;
  const host = init.host ?? HTTP_DEFAULT_HOST;
  const path = normalizeHttpPath(init.path ?? MCP_DEFAULT_PATH);
  const port = init.port ?? HTTP_DEFAULT_PORT;
  const registry = init.registry ?? createHttpRegistry();
  const sse = createMcpSseHub();
  let server: http.Server | undefined;
  let unsub: (() => void) | undefined;
  let detachWs: (() => void) | undefined;
  return {
    id: 'http',
    async start(commandHost) {
      log('[HTTP] Starting server');
      unsub = commandHost.notifier?.subscribe(mcpNotifierSink(sse));
      const initialized = { value: false };
      server = http.createServer((req, res) => {
        void handleHttpRequest(req, res, {
          path,
          routes: commandHost.http?.routes() ?? registry.routes(),
          tools: commandHost,
          initialized,
          log,
          sse,
        });
      });
      detachWs = attachHttpWebSockets(server, commandHost.http ?? registry).detach;
      const bound = await listenLocalhost(server, port, host);
      await logListening(commandHost, host, bound, path, log);
      init.onListening?.({ url: httpListenUrl(host, bound, path), port: bound });
      await waitForClose(server);
      log('[HTTP] Server closed');
    },
    async stop() {
      log('[HTTP] Stopping');
      unsub?.();
      detachWs?.();
      sse.close();
      await closeServer(server);
    },
  };
}

async function logListening(
  commandHost: { listTools: () => Promise<{ name: string }[]> | { name: string }[] },
  host: string,
  bound: number,
  path: string,
  log: LogFn,
): Promise<void> {
  const names = (await commandHost.listTools()).map((t) => t.name);
  log(`[HTTP] Listening on ${httpListenUrl(host, bound, path)} (${names.join(', ') || 'no tools'})`);
}
