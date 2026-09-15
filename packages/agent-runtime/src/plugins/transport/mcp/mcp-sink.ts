import type { MinionAsk, MinionEvent, NotifierSink } from '@/types/notify.js';
import { elicitationParams } from './elicitation.js';
import { decisionFromSample, samplingParams } from './sample-decision.js';
import type { McpSseHub } from './sse-hub.js';

const ELICIT_MS = 30_000;

export function mcpNotifierSink(sse: McpSseHub): NotifierSink {
  let elicitQueue = Promise.resolve<unknown>(undefined);
  return {
    notify(event) {
      sse.broadcast({
        jsonrpc: '2.0',
        method: 'notifications/message',
        params: { level: levelFor(event.type), logger: 'minion', data: eventForClient(event) },
      });
    },
    async ask(request) {
      const sampled = await sample(sse, request);
      if (sampled !== undefined) return sampled;
      if (!sse.supportsElicitation()) return undefined;
      const run = elicitQueue.then(() => elicit(sse, request), () => elicit(sse, request));
      elicitQueue = run.then(() => undefined, () => undefined);
      return run.catch(() => undefined);
    },
  };
}

async function sample(sse: McpSseHub, request: MinionAsk): Promise<unknown | undefined> {
  if (!sse.supportsSampling()) return undefined;
  try {
    return decisionFromSample(await sse.request('sampling/createMessage', samplingParams(request)));
  } catch {
    return undefined;
  }
}

function elicit(sse: McpSseHub, request: MinionAsk): Promise<unknown | undefined> {
  return Promise.race([sse.request('elicitation/create', elicitationParams(request)), delay(ELICIT_MS)]);
}

function delay(ms: number): Promise<undefined> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), ms);
    timer.unref?.();
  });
}

function eventForClient(event: MinionEvent): Pick<MinionEvent, 'minionId' | 'type' | 'message'> {
  return { minionId: event.minionId, type: event.type, message: event.message };
}

function levelFor(type: MinionEvent['type']): string {
  if (type === 'failure') return 'error';
  if (type === 'auth' || type === 'permission' || type === 'question') return 'warning';
  return 'info';
}
