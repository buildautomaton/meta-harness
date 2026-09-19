import type { NotifierSink } from '@/types/notify.js';
import type { JsonRpcMessage } from '@plugins/transport/http/jsonrpc.js';

export function stdioNotifierSink(write: (msg: JsonRpcMessage) => void): NotifierSink {
  return {
    notify(event) {
      write({
        jsonrpc: '2.0',
        method: 'notifications/message',
        params: {
          level: event.type === 'failure' ? 'error' : 'info',
          logger: 'minion',
          data: { minionId: event.minionId, type: event.type, message: event.message },
        },
      });
    },
  };
}
