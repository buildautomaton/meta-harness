import type { SessionCompactPayload } from './log.js';
import type { SessionEvent, SessionListener, SessionRecord, SessionSnapshot } from './records.js';

/** Methods a session plugin may override. */
export type SessionImplementation = {
  create(record: SessionRecord): Promise<void> | void;
  append(sessionId: string, event: SessionEvent): Promise<void> | void;
  patch(sessionId: string, patch: Partial<SessionRecord>): Promise<void> | void;
  get(sessionId: string): Promise<SessionSnapshot | null> | SessionSnapshot | null;
  list(): Promise<SessionRecord[]> | SessionRecord[];
  compact?(sessionId: string, payload: SessionCompactPayload): Promise<void> | void;
  subscribe?(sessionId: string, listener: SessionListener): () => void;
};
