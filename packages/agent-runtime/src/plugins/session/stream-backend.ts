import type { SessionBackend } from '../../runtime/session/types.js';
import type {
  SessionEvent,
  SessionListener,
  SessionSnapshot,
} from '../../types/session/records.js';
import { isoNow } from '../../runtime/core/iso-now.js';

/** In-memory session store with subscribe(); optionally mirrors an inner backend. */
export function createStreamBackend(inner?: SessionBackend): SessionBackend {
  const store = new Map<string, SessionSnapshot>();
  const listeners = new Map<string, Set<SessionListener>>();

  async function load(id: string): Promise<SessionSnapshot | null> {
    const local = store.get(id);
    if (local) return local;
    const fromInner = inner ? await inner.get(id) : null;
    if (fromInner) store.set(id, fromInner);
    return fromInner;
  }

  function emit(id: string, event: SessionEvent, snapshot: SessionSnapshot) {
    for (const fn of listeners.get(id) ?? []) fn(event, snapshot);
  }

  return {
    id: inner ? `stream+${inner.id}` : 'stream',
    async create(record) {
      store.set(record.id, { session: record, events: [] });
      await inner?.create(record);
    },
    async append(sessionId, event) {
      const snap = (await load(sessionId)) ?? {
        session: { id: sessionId } as SessionSnapshot['session'],
        events: [],
      };
      snap.events.push(event);
      store.set(sessionId, snap);
      await inner?.append(sessionId, event);
      emit(sessionId, event, snap);
    },
    async patch(sessionId, patch) {
      const snap = await load(sessionId);
      if (snap) {
        snap.session = { ...snap.session, ...patch, updatedAt: isoNow() };
        store.set(sessionId, snap);
      }
      await inner?.patch(sessionId, patch);
    },
    async get(sessionId) {
      return load(sessionId);
    },
    async list() {
      if (inner) return inner.list();
      return [...store.values()].map((s) => s.session);
    },
    subscribe(sessionId, listener) {
      const set = listeners.get(sessionId) ?? new Set();
      set.add(listener);
      listeners.set(sessionId, set);
      return () => set.delete(listener);
    },
  };
}
