import type { JsonRpcMessage } from './jsonrpc.js';
import type { McpSseHub } from './sse-hub.js';

export function progressTokenFromParams(params: Record<string, unknown>): string | number | undefined {
  const meta = params._meta;
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return undefined;
  const token = (meta as Record<string, unknown>).progressToken;
  if (typeof token === 'string' || typeof token === 'number') return token;
  return undefined;
}

export function createProgressReporter(
  sse: McpSseHub | undefined,
  onNotify: ((msg: JsonRpcMessage) => void) | undefined,
  token: string | number | undefined,
): (update: { message: string; progress?: number }) => void {
  let n = 0;
  return (update) => {
    n += 1;
    const progress = update.progress ?? n;
    if (token !== undefined) {
      onNotify?.({
        jsonrpc: '2.0',
        method: 'notifications/progress',
        params: { progressToken: token, progress, message: update.message },
      });
    }
    const note: JsonRpcMessage = {
      jsonrpc: '2.0',
      method: 'notifications/message',
      params: { level: 'info', logger: 'minion', data: { type: 'progress', message: update.message, progress } },
    };
    sse?.broadcast(note);
    onNotify?.(note);
  };
}
