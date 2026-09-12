import { RUNTIME_VERSION } from '../../../runtime/core/version.js';
import type { ToolRegistry } from '../../../types/tools/implementation.js';
import {
  jsonRpcError,
  jsonRpcResult,
  rpcParams,
  type JsonRpcMessage,
} from './jsonrpc-stdio.js';

export const MCP_PROTOCOL_VERSION = '2024-11-05';
export const MCP_SERVER_NAME = 'meta-harness';

export async function handleMcpMethod(
  msg: JsonRpcMessage,
  tools: ToolRegistry,
  initialized: { value: boolean },
): Promise<void> {
  const method = typeof msg.method === 'string' ? msg.method : '';
  const id = msg.id;
  const params = rpcParams(msg);
  if (method === 'notifications/initialized' || method === 'initialized') {
    initialized.value = true;
    return;
  }
  if (id === undefined && method.startsWith('notifications/')) return;
  if (method === 'initialize') {
    initialized.value = true;
    jsonRpcResult(id, {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: MCP_SERVER_NAME, version: RUNTIME_VERSION },
    });
    return;
  }
  if (!initialized.value && method !== 'initialize') {
    jsonRpcError(id, -32002, 'Server not initialized');
    return;
  }
  if (method === 'tools/list') {
    jsonRpcResult(id, { tools: await tools.listTools() });
    return;
  }
  if (method === 'tools/call') {
    await callTool(id, params, tools);
    return;
  }
  if (id !== undefined) jsonRpcError(id, -32601, `Method not found: ${method}`);
}

async function callTool(
  id: JsonRpcMessage['id'],
  params: Record<string, unknown>,
  tools: ToolRegistry,
): Promise<void> {
  const name = typeof params.name === 'string' ? params.name : '';
  const args =
    params.arguments && typeof params.arguments === 'object' && !Array.isArray(params.arguments)
      ? (params.arguments as Record<string, unknown>)
      : {};
  if (!name) {
    jsonRpcError(id, -32602, 'tools/call requires name');
    return;
  }
  try {
    jsonRpcResult(id, await tools.callTool(name, args));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    jsonRpcResult(id, { content: [{ type: 'text', text: message }], isError: true });
  }
}
