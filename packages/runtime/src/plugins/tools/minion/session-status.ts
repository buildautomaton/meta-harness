import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { MinionPendingRequest } from '@/types/notify.js';
import type { SessionRecord, SessionStatusResult } from '@/types/session/records.js';
import { localAgentErrorSuggestsAuth } from '@runtime/harnesses/auth/local-agent-auth.js';
import { compactAgentTranscript } from '@plugins/session/transcript.js';
import { authCoordinatorRequest } from './coordinator-request.js';

export async function getSessionStatus(
  backend: SessionImplementation,
  sessionId: string,
  pending: MinionPendingRequest[] = [],
  engine?: AcpEngine,
): Promise<SessionStatusResult | null> {
  const snapshot = await backend.get(sessionId);
  if (!snapshot) return null;
  const { session, events } = snapshot;
  const transcript = session.transcript?.trim() || compactAgentTranscript(events);
  const authRequired = localAgentErrorSuggestsAuth(
    engine?.getHarness(session.harness)?.authErrorHints,
    session.error,
  );
  const pendingRequests = withAuthRequest(session, pending, authRequired);
  return {
    minionId: session.id,
    status: session.status,
    harness: session.harness,
    model: session.model,
    cwd: session.cwd,
    error: session.error,
    authRequired,
    pendingRequests,
    needsUser: pendingRequests.length > 0 || authRequired,
    transcript,
    summary: transcript.length <= 4000 ? transcript : transcript.slice(transcript.length - 4000),
    ...(engine && authRequired
      ? { authEnvVar: engine.getHarness(session.harness)?.installTokenEnvVar }
      : {}),
  };
}

function withAuthRequest(
  session: SessionRecord,
  pending: MinionPendingRequest[],
  authRequired: boolean,
): MinionPendingRequest[] {
  if (!authRequired || pending.some((item) => item.kind === 'auth')) return pending;
  const { minionId: _id, ...auth } = authCoordinatorRequest(session.id, session.harness);
  return [...pending, auth];
}
