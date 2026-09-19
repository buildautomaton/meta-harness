import { createCursorJsonRpcInboundRespond } from './cursor-json-rpc-inbound-respond.js';
import { createCursorJsonRpcOutboundPending } from './cursor-json-rpc-outbound.js';
import { writeJsonRpcLine } from './cursor-json-rpc-stdin-write.js';

export function createCursorJsonRpcWriter(stdin: NodeJS.WritableStream) {
  const inbound = createCursorJsonRpcInboundRespond(stdin);
  const outbound = createCursorJsonRpcOutboundPending();

  function send(method: string, params: Record<string, unknown>): Promise<unknown> {
    const id = outbound.allocateId();
    return new Promise((res, rej) => {
      outbound.register(id, { resolve: res, reject: rej });
      writeJsonRpcLine(stdin, { jsonrpc: '2.0', id, method, params }, (err) => {
        if (err) outbound.rejectOnWriteError(id, err);
      });
    });
  }

  return {
    send,
    cancelSessionNotification: inbound.cancelSessionNotification,
    respond: inbound.respond,
    respondJsonRpcError: inbound.respondJsonRpcError,
    settleResponse: outbound.settleResponse,
  };
}
