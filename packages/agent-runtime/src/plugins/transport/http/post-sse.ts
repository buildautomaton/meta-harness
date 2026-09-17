import type { IncomingMessage, ServerResponse } from 'node:http';
import type { LogFn } from '@/types/log.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';
import { writeSseMessage } from './sse-write.js';
import { handleMcpMethod } from './methods.js';
import type { JsonRpcMessage } from './jsonrpc.js';
import type { McpSseHub } from './sse-hub.js';

export async function handleStreamingToolCall(
  req: IncomingMessage,
  res: ServerResponse,
  ctx: { tools: ToolRegistry; initialized: { value: boolean }; log: LogFn; sse: McpSseHub },
  headers: Record<string, string>,
  msg: JsonRpcMessage,
): Promise<boolean> {
  const accept = req.headers.accept ?? '';
  if (!accept.includes('text/event-stream') || msg.method !== 'tools/call') return false;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    ...headers,
  });
  const detach = ctx.sse.addWriter((note) => writeSseMessage(res, note));
  try {
    const reply = await handleMcpMethod(
      msg,
      ctx.tools,
      ctx.initialized,
      ctx.log,
      ctx.sse,
      (note) => writeSseMessage(res, note),
    );
    if (reply) writeSseMessage(res, reply);
  } finally {
    detach();
    res.end();
  }
  return true;
}
