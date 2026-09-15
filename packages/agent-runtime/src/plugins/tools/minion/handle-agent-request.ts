import type { SessionEventHost } from './session-events.js';
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
  if (typeof rec.requestId !== 'string' || !options.engine) return;
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
  void options.notifier?.ask(ask).then(async (elicited) => {
    await storeElicitedAuth(options.engine!, options.backend, sessionId, elicited);
    const decided = decisionFromElicitation(elicited);
    if (decided !== undefined) options.pending?.complete(rec.requestId!, decided);
  });
  const result = waited ?? permissionResultFromDecision({ outcome: 'allow-once' }, rec.params);
  options.engine.resolveRequest(rec.requestId, await result);
}
