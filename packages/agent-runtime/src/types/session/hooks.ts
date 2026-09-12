import type { SessionEvent, SessionSnapshot } from './records.js';

/** Notifications a session plugin may send to the host. */
export type SessionHooks = {
  onSessionEvent?: (sessionId: string, event: SessionEvent, snapshot: SessionSnapshot) => void;
  onSessionComplete?: (snapshot: SessionSnapshot) => void;
};
