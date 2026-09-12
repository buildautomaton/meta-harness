import type { SessionImplementation } from '../../types/session/implementation.js';
import type { SessionStatusResult } from '../../types/session/records.js';
import { transcriptTail } from '../session/transcript.js';

export async function getSessionStatus(
  backend: SessionImplementation,
  sessionId: string,
): Promise<SessionStatusResult | null> {
  const snapshot = await backend.get(sessionId);
  if (!snapshot) return null;
  const { session, events } = snapshot;
  return {
    sessionId: session.id,
    status: session.status,
    harness: session.harness,
    model: session.model,
    error: session.error,
    summary: transcriptTail(events),
  };
}
