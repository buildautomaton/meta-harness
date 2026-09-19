import type { IncomingMessage, ServerResponse } from 'node:http';
import type { SessionImplementation } from '@/types/session/implementation.js';
import { MCP_CORS } from '@plugins/transport/http/cors.js';

export async function handleSessionHttp(
  req: IncomingMessage,
  res: ServerResponse,
  backend: SessionImplementation,
  pathname: string,
  mount: string,
): Promise<void> {
  const rest = pathname === mount ? '' : pathname.startsWith(`${mount}/`) ? pathname.slice(mount.length + 1) : null;
  if (rest === null || (req.method ?? 'GET') !== 'GET') {
    res.writeHead(rest === null ? 404 : 405, MCP_CORS);
    res.end(rest === null ? 'Not found' : undefined);
    return;
  }
  if (!rest) {
    writeJson(res, 200, await backend.list());
    return;
  }
  const snapshot = await backend.get(decodeURIComponent(rest.split('/')[0]!));
  if (!snapshot) {
    writeJson(res, 404, { error: 'Not found' });
    return;
  }
  writeJson(res, 200, snapshot);
}

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { ...MCP_CORS, 'content-type': 'application/json' });
  res.end(`${JSON.stringify(body)}\n`);
}
