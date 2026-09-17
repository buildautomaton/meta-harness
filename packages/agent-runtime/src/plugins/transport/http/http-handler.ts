import type { IncomingMessage, ServerResponse } from 'node:http';
import { MCP_CORS } from './cors.js';
import { matchEndpoint } from './match-endpoint.js';
import { handleMcpProtocol, type McpHttpContext } from './mcp-protocol.js';
import { dispatchWorkHttp } from '@plugins/work/http/dispatch.js';

export type { McpHttpContext } from './mcp-protocol.js';
export { MCP_CORS } from './cors.js';

export async function handleHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  ctx: McpHttpContext,
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, MCP_CORS);
    res.end();
    return;
  }
  const pathname = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
  const endpoints = ctx.endpoints ?? [{ kind: 'tools' as const, path: ctx.path }];
  const hit = matchEndpoint(endpoints, pathname);
  if (!hit) {
    res.writeHead(404, MCP_CORS);
    res.end('Not found');
    return;
  }
  if (hit.kind === 'tools') {
    await handleMcpProtocol(req, res, ctx);
    return;
  }
  if (hit.kind === 'work' && hit.work) {
    await dispatchWorkHttp(req, res, hit.work, pathname, hit.path, hit.surface);
    return;
  }
  res.writeHead(404, MCP_CORS);
  res.end('Not found');
}

/** @deprecated Use handleHttpRequest. */
export const handleMcpHttpRequest = handleHttpRequest;
