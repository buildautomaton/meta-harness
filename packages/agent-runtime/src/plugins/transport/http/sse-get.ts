import type { IncomingMessage, ServerResponse } from 'node:http';
import type { McpSseHub } from './sse-hub.js';

export function handleMcpSseGet(
  req: IncomingMessage,
  res: ServerResponse,
  sse: McpSseHub,
  headers: Record<string, string>,
): void {
  const accept = req.headers.accept ?? '';
  if (!accept.includes('text/event-stream')) {
    res.writeHead(406, { ...headers, Allow: 'GET, POST, OPTIONS' });
    res.end();
    return;
  }
  sse.addClient(res, headers);
}
