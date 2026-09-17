import type { IncomingMessage, ServerResponse } from 'node:http';
import type { LogFn } from '@/types/log.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';
import { handleMcpMethod } from './methods.js';
import { handleStreamingToolCall } from './post-sse.js';
import { jsonRpcError, parseRpcJson, type JsonRpcMessage } from './jsonrpc.js';
import { readRequestBody } from './http-read-body.js';
import { handleMcpSseGet } from './sse-get.js';
import type { McpSseHub } from './sse-hub.js';
import { MCP_CORS } from './cors.js';
import type { ResolvedHttpEndpoint } from './match-endpoint.js';

export type McpHttpContext = {
  path: string;
  endpoints?: ResolvedHttpEndpoint[];
  tools: ToolRegistry;
  initialized: { value: boolean };
  log: LogFn;
  sse: McpSseHub;
};

export async function handleMcpProtocol(
  req: IncomingMessage,
  res: ServerResponse,
  ctx: McpHttpContext,
): Promise<void> {
  if (req.method === 'GET') {
    handleMcpSseGet(req, res, ctx.sse, MCP_CORS);
    return;
  }
  if (req.method !== 'POST') {
    res.writeHead(405, { ...MCP_CORS, Allow: 'GET, POST, OPTIONS' });
    res.end();
    return;
  }
  await handlePost(req, res, ctx);
}

async function handlePost(req: IncomingMessage, res: ServerResponse, ctx: McpHttpContext): Promise<void> {
  let raw: string;
  try {
    raw = await readRequestBody(req);
  } catch (err) {
    const tooLarge = err instanceof Error && err.message === 'Request body too large';
    res.writeHead(tooLarge ? 413 : 400, MCP_CORS);
    res.end();
    return;
  }
  const msg = parseRpcJson(raw);
  if (!msg) {
    writeJson(res, 400, jsonRpcError(null, -32700, 'Parse error'));
    return;
  }
  if (await handleStreamingToolCall(req, res, ctx, MCP_CORS, msg)) return;
  const reply = await handleMcpMethod(msg, ctx.tools, ctx.initialized, ctx.log, ctx.sse);
  if (!reply) {
    res.writeHead(202, MCP_CORS);
    res.end();
    return;
  }
  writeJson(res, 200, reply);
}

function writeJson(res: ServerResponse, status: number, body: JsonRpcMessage): void {
  res.writeHead(status, { ...MCP_CORS, 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}
