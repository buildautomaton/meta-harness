export type JsonRpcMessage = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: { code: number; message: string };
};

export function jsonRpcError(id: JsonRpcMessage['id'], code: number, message: string): JsonRpcMessage {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

export function jsonRpcResult(id: JsonRpcMessage['id'], result: unknown): JsonRpcMessage {
  return { jsonrpc: '2.0', id, result };
}

export function parseRpcJson(raw: string): JsonRpcMessage | null {
  try {
    return JSON.parse(raw) as JsonRpcMessage;
  } catch {
    return null;
  }
}

export function rpcParams(msg: JsonRpcMessage): Record<string, unknown> {
  return msg.params && typeof msg.params === 'object' && !Array.isArray(msg.params)
    ? (msg.params as Record<string, unknown>)
    : {};
}
