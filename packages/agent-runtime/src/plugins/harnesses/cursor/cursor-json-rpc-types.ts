export type PendingRequest = {
  method: string;
  params: Record<string, unknown>;
};

export type JsonRpcRequestId = number | string;

export function parseIncomingJsonRpcRequestId(raw: unknown): JsonRpcRequestId | undefined {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.length > 0) return raw;
  return undefined;
}

export const FS_READ_METHODS = new Set(['fs/read_text_file', 'fs/readTextFile']);
export const FS_WRITE_METHODS = new Set(['fs/write_text_file', 'fs/writeTextFile']);

export function isCursorFsReadMethod(method: string): boolean {
  if (FS_READ_METHODS.has(method)) return true;
  const lower = method.toLowerCase();
  return lower.startsWith('fs/') && lower.includes('read');
}

export function isCursorFsWriteMethod(method: string): boolean {
  if (FS_WRITE_METHODS.has(method)) return true;
  const lower = method.toLowerCase();
  return lower.startsWith('fs/') && lower.includes('write');
}
