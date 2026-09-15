import type { MinionAsk, MinionEvent, NotifierSink } from '@/types/notify.js';
import { elicitationParams } from './elicitation.js';
import type { McpSseHub } from './sse-hub.js';

export function mcpNotifierSink(sse: McpSseHub): NotifierSink {
  let queue = Promise.resolve<unknown>(undefined);
  return {
    notify(event) {
      sse.broadcast({
        jsonrpc: '2.0',
        method: 'notifications/message',
        params: { level: levelFor(event.type), logger: 'minion', data: event },
      });
    },
    ask(request) {
      if (!sse.supportsElicitation()) return Promise.resolve(undefined);
      const run = queue.then(() => elicit(sse, request), () => elicit(sse, request));
      queue = run.then(() => undefined, () => undefined);
      return run.catch(() => undefined);
    },
  };
}

function elicit(sse: McpSseHub, request: MinionAsk): Promise<unknown> {
  return sse.request('elicitation/create', elicitationParams(request));
}

function levelFor(type: MinionEvent['type']): string {
  if (type === 'failure') return 'error';
  if (type === 'auth' || type === 'permission' || type === 'question') return 'warning';
  return 'info';
}
