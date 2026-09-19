import { writeJsonRpcLine } from './cursor-json-rpc-stdin-write.js';
import type { JsonRpcRequestId } from './cursor-json-rpc-types.js';

export function createCursorJsonRpcInboundRespond(stdin: NodeJS.WritableStream) {
  function respond(id: JsonRpcRequestId, result: unknown): void {
    writeJsonRpcLine(stdin, { jsonrpc: '2.0', id, result });
  }

  function respondJsonRpcError(id: JsonRpcRequestId, code: number, message: string): void {
    writeJsonRpcLine(stdin, { jsonrpc: '2.0', id, error: { code, message } });
  }

  function cancelSessionNotification(sessionId: string): Promise<void> {
    const line = JSON.stringify({
      jsonrpc: '2.0',
      method: 'session/cancel',
      params: { sessionId },
    });
    return new Promise((res, rej) => {
      stdin.write(line + '\n', (err) => (err ? rej(err) : res()));
    });
  }

  return { respond, respondJsonRpcError, cancelSessionNotification };
}
