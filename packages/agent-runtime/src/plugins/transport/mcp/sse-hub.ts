import type { ServerResponse } from 'node:http';
import type { JsonRpcMessage } from './jsonrpc.js';
import { writeSseComment, writeSseMessage } from './sse-write.js';

const PING_MS = 15_000;

export type McpSseHub = {
  addClient(res: ServerResponse, headers: Record<string, string>): void;
  addWriter(write: (msg: JsonRpcMessage) => void): () => void;
  broadcast(msg: JsonRpcMessage): void;
  request(method: string, params: unknown): Promise<unknown>;
  complete(id: string | number, result?: unknown, error?: { message?: string }): void;
  setElicitation(supported: boolean): void;
  supportsElicitation(): boolean;
  close(): void;
};

export function createMcpSseHub(): McpSseHub {
  const clients = new Set<ServerResponse>();
  const writers = new Set<(msg: JsonRpcMessage) => void>();
  const pending = new Map<number, { resolve: (value: unknown) => void; reject: (err: Error) => void }>();
  let nextId = 1;
  let elicitation = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  function ping(): void {
    for (const res of clients) writeSseComment(res, 'ping');
  }

  return {
    addClient(res, headers) {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', ...headers });
      res.write('\n');
      clients.add(res);
      if (!timer) {
        timer = setInterval(ping, PING_MS);
        timer.unref?.();
      }
      res.on('close', () => {
        clients.delete(res);
      });
    },
    addWriter(write) {
      writers.add(write);
      return () => {
        writers.delete(write);
      };
    },
    broadcast(msg) {
      for (const res of clients) writeSseMessage(res, msg);
      for (const write of writers) write(msg);
    },
    request(method, params) {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        this.broadcast({ jsonrpc: '2.0', id, method, params });
      });
    },
    complete(id, result, error) {
      const numeric = typeof id === 'number' ? id : Number(id);
      const entry = pending.get(numeric);
      if (!entry) return;
      pending.delete(numeric);
      if (error) entry.reject(new Error(error.message ?? 'MCP client error'));
      else entry.resolve(result);
    },
    setElicitation(supported) {
      elicitation = supported;
    },
    supportsElicitation() {
      return elicitation;
    },
    close() {
      if (timer) clearInterval(timer);
      timer = undefined;
      for (const res of clients) res.end();
      clients.clear();
      writers.clear();
    },
  };
}
