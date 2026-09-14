import type { MinionEvent, NotifierSink } from '../../../types/notify.js';
import { elicitationParams } from './elicitation.js';
import type { McpSseHub } from './sse-hub.js';

export function mcpNotifierSink(sse: McpSseHub): NotifierSink {
  return {
    notify(event) {
      sse.broadcast({
        jsonrpc: '2.0',
        method: 'notifications/message',
        params: { level: levelFor(event.type), logger: 'minion', data: event },
      });
    },
    async ask(request) {
      if (!sse.supportsElicitation()) return undefined;
      try {
        return await sse.request('elicitation/create', elicitationParams(request));
      } catch {
        return undefined;
      }
    },
  };
}

function levelFor(type: MinionEvent['type']): string {
  if (type === 'failure') return 'error';
  if (type === 'auth' || type === 'permission' || type === 'question') return 'warning';
  return 'info';
}
