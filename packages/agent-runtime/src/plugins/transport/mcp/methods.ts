import type { LogFn } from '../../../types/log.js';
import type { ToolRegistry } from '../../../types/tools/implementation.js';
import { clientSupportsElicitation } from './client-caps.js';
import { mcpInitializeResult } from './initialize-result.js';
import { jsonRpcError, jsonRpcResult, rpcParams, type JsonRpcMessage } from './jsonrpc.js';
import { createProgressReporter, progressTokenFromParams } from './progress-reporter.js';
import { getMcpPrompt, listMcpPrompts } from './prompts.js';
import type { McpSseHub } from './sse-hub.js';

export { MCP_PROTOCOL_VERSION, MCP_SERVER_NAME } from './initialize-result.js';

export async function handleMcpMethod(
  msg: JsonRpcMessage,
  tools: ToolRegistry,
  initialized: { value: boolean },
  log: LogFn = () => {},
  sse?: McpSseHub,
  onNotify?: (note: JsonRpcMessage) => void,
): Promise<JsonRpcMessage | undefined> {
  if (msg.method == null && msg.id !== undefined && msg.id !== null && (msg.result !== undefined || msg.error)) {
    sse?.complete(msg.id, msg.result, msg.error);
    return undefined;
  }
  const method = typeof msg.method === 'string' ? msg.method : '';
  const id = msg.id;
  const params = rpcParams(msg);
  if (method === 'notifications/initialized' || method === 'initialized') {
    initialized.value = true;
    log('[MCP] Client initialized; accepting tool calls');
    return undefined;
  }
  if (id === undefined && method.startsWith('notifications/')) return undefined;
  if (method === 'initialize') {
    initialized.value = true;
    sse?.setElicitation(clientSupportsElicitation(params));
    log('[MCP] Initialize complete; server ready');
    return mcpInitializeResult(id, await tools.instructions?.());
  }
  if (!initialized.value && method !== 'initialize') {
    return jsonRpcError(id, -32002, 'Server not initialized');
  }
  if (method === 'ping' || method === 'logging/setLevel') return jsonRpcResult(id, {});
  if (method === 'prompts/list') return listMcpPrompts(id, (await tools.prompts?.()) ?? []);
  if (method === 'prompts/get') return getMcpPrompt(id, params, (await tools.prompts?.()) ?? []);
  if (method === 'tools/list') return jsonRpcResult(id, { tools: await tools.listTools() });
  if (method === 'tools/call') return callTool(id, params, tools, sse, onNotify);
  if (id !== undefined) return jsonRpcError(id, -32601, `Method not found: ${method}`);
  return undefined;
}

async function callTool(
  id: JsonRpcMessage['id'],
  params: Record<string, unknown>,
  tools: ToolRegistry,
  sse?: McpSseHub,
  onNotify?: (note: JsonRpcMessage) => void,
): Promise<JsonRpcMessage> {
  const name = typeof params.name === 'string' ? params.name : '';
  const args =
    params.arguments && typeof params.arguments === 'object' && !Array.isArray(params.arguments)
      ? (params.arguments as Record<string, unknown>)
      : {};
  if (!name) return jsonRpcError(id, -32602, 'tools/call requires name');
  const extras = {
    reportProgress: createProgressReporter(sse, onNotify, progressTokenFromParams(params)),
  };
  try {
    return jsonRpcResult(id, await tools.callTool(name, args, extras));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonRpcResult(id, { content: [{ type: 'text', text: message }], isError: true });
  }
}
