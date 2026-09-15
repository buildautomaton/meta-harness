import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { SessionHooks } from '@/types/session/hooks.js';
import type { ToolsHooks } from '@/types/tools/hooks.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { SessionEvent } from '@/types/session/records.js';
import type { NotifierHub } from '@/types/notify.js';
import { isoNow } from '@runtime/core/iso-now.js';
import { localAgentErrorSuggestsAuth } from '@runtime/harnesses/auth/local-agent-auth.js';
import { emitMinionEvent } from './emit-progress.js';
import { compactAgentTranscript } from '@plugins/session/transcript.js';
import { compactSessionLog } from '@plugins/session/compact-log.js';
import { authCoordinatorRequest, coordinatorNotice } from './coordinator-request.js';
import type { PendingStore } from './pending-store.js';

export type SessionEventHost = {
  backend: SessionImplementation;
  engine?: AcpEngine;
  sessionHooks?: SessionHooks;
  toolsHooks?: ToolsHooks;
  notifier?: NotifierHub;
  pending?: PendingStore;
};

export async function appendSessionEvent(
  options: SessionEventHost,
  sessionId: string,
  kind: SessionEvent['kind'],
  payload: unknown,
): Promise<void> {
  const event: SessionEvent = { ts: isoNow(), kind, payload };
  await options.backend.append(sessionId, event);
  const snapshot = await options.backend.get(sessionId);
  if (snapshot) options.sessionHooks?.onSessionEvent?.(sessionId, event, snapshot);
}

export async function finishSession(
  options: SessionEventHost,
  sessionId: string,
  result: { success: boolean; error?: string },
): Promise<void> {
  await options.backend.patch(sessionId, {
    status: result.success ? 'completed' : 'failed',
    error: result.error,
  });
  await appendSessionEvent(options, sessionId, 'result', result);
  const snapshot = await options.backend.get(sessionId);
  if (snapshot) options.sessionHooks?.onSessionComplete?.(snapshot);
  const events = snapshot?.events ?? [];
  const transcript = compactAgentTranscript(events);
  const log = compactSessionLog(events);
  await options.backend.patch(sessionId, { transcript, log });
  await options.backend.compact?.(sessionId, { transcript, log });
  const authRequired = localAgentErrorSuggestsAuth(
    options.engine?.getHarness(snapshot?.session.harness)?.authErrorHints,
    result.error,
  );
  options.pending?.denyAll(sessionId, { outcome: { outcome: 'cancelled' } });
  emitMinionEvent(options.notifier, finishEvent(sessionId, result, authRequired, snapshot?.session.harness));
}

function finishEvent(
  sessionId: string,
  result: { success: boolean; error?: string },
  authRequired: boolean,
  harness?: string,
) {
  if (result.success) {
    return { minionId: sessionId, type: 'completed' as const, message: 'Minion completed', payload: { status: 'completed' } };
  }
  if (authRequired) {
    const ask = authCoordinatorRequest(sessionId, harness ?? 'unknown harness');
    return { minionId: sessionId, type: 'auth' as const, message: coordinatorNotice(ask), payload: ask };
  }
  return {
    minionId: sessionId,
    type: 'failure' as const,
    message: `Minion failed: ${result.error ?? 'unknown error'}`,
    payload: { status: 'failed', error: result.error },
  };
}
