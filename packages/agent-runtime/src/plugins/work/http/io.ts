import type { IncomingMessage, ServerResponse } from 'node:http';
import { MCP_CORS } from '@plugins/transport/http/cors.js';

export function writeJson(res: ServerResponse, status: number, body: unknown): void {
  if (status === 204) {
    res.writeHead(204, MCP_CORS);
    res.end();
    return;
  }
  res.writeHead(status, { ...MCP_CORS, 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}
