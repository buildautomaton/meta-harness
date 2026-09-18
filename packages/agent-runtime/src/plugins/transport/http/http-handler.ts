import type { IncomingMessage, ServerResponse } from 'node:http';
import type { HttpRoute } from '@/types/http/registry.js';
import { MCP_CORS } from './cors.js';
import { matchEndpoint } from './match-endpoint.js';
import { handleMcpProtocol, type McpHttpContext } from './mcp-protocol.js';

export type { McpHttpContext } from './mcp-protocol.js';
export { MCP_CORS } from './cors.js';

export type HttpDispatchContext = McpHttpContext & {
  routes?: readonly HttpRoute[];
};

export async function handleHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  ctx: HttpDispatchContext,
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, MCP_CORS);
    res.end();
    return;
  }
  const pathname = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
  const route = matchEndpoint(ctx.routes ?? [], pathname);
  if (route) {
    await route.handler(req, res, { pathname, mount: route.path });
    return;
  }
  if (pathname === ctx.path || pathname.startsWith(`${ctx.path}/`)) {
    await handleMcpProtocol(req, res, ctx);
    return;
  }
  res.writeHead(404, MCP_CORS);
  res.end('Not found');
}

/** @deprecated Use handleHttpRequest. */
export const handleMcpHttpRequest = handleHttpRequest;
