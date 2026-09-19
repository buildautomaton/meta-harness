import type { SessionEventHost } from './session-events.js';
import type { MinionAsk } from '@/types/notify.js';
import { appendSessionEvent } from './session-events.js';
import { emitMinionEvent } from './emit-progress.js';
import { decisionFromElicitation, permissionResultFromDecision } from './permission-result.js';
import { storeElicitedAuth } from './apply-auth.js';
import { coordinatorNotice, coordinatorRequest } from './coordinator-request.js';
import { minionRequestKind, summarizeMinionRequest, unwrapAgentRequest } from './request-shape.js';

export async function handleAgentRequest(
  options: SessionEventHost,
  sessionId: string,
  payload: unknown,
): Promise<void> {
  await appendSessionEvent(options, sessionId, 'request', payload);
  const rec = unwrapAgentRequest(payload);
  if (!rec.requestId || !options.engine) return;
  const kind = minionRequestKind(rec.kind, rec.method);
  const ask = coordinatorRequest(
    sessionId,
    rec.requestId,
    kind,
    summarizeMinionRequest(rec.method, rec.params),
    rec.params,
    rec.method,
  );
  emitMinionEvent(options.notifier, {
    minionId: sessionId,
    type: kind,
    message: coordinatorNotice(ask),
    payload: ask,
  });
  if (options.toolsHooks?.resolvePermission) {
    const result = await options.toolsHooks.resolvePermission({
      requestId: rec.requestId,
      method: rec.method,
      params: rec.params,
    });
    options.engine.resolveRequest(rec.requestId, result);
    return;
  }
  const waited = options.pending?.add(ask);
  void retryAsk(options, sessionId, rec.requestId, rec.params, ask);
  const result = waited ?? permissionResultFromDecision({ outcome: 'allow-once' }, rec.params);
  options.engine.resolveRequest(rec.requestId, await result);
}

async function retryAsk(
  options: SessionEventHost,
  sessionId: string,
  requestId: string,
  params: Record<string, unknown>,
  ask: MinionAsk,
): Promise<void> {
  while (options.pending?.has(requestId)) {
    const elicited = await options.notifier?.ask(ask);
    await storeElicitedAuth(options.engine!, options.backend, sessionId, elicited);
    const decided = decisionFromElicitation(elicited, params);
    if (decided !== undefined) {
      options.pending?.complete(requestId, decided);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
