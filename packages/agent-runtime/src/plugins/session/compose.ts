import type { SessionImplementation } from '@/types/session/implementation.js';

export function composeSessionStores(
  disk?: SessionImplementation,
  sql?: SessionImplementation,
): SessionImplementation {
  const primary = disk ?? sql;
  if (!primary) throw new Error('session plugin requires a file-store or sql-store plugin');
  if (!disk || !sql) return primary;
  return {
    create: async (record) => {
      await disk.create(record);
      await sql.create(record);
    },
    append: (sessionId, event) => disk.append(sessionId, event),
    patch: async (sessionId, patch) => {
      await disk.patch(sessionId, patch);
      await sql.patch(sessionId, patch);
    },
    get: (sessionId) => disk.get(sessionId),
    list: () => disk.list(),
    compact: async (sessionId, payload) => {
      await disk.compact?.(sessionId, payload);
      await sql.compact?.(sessionId, payload);
    },
    subscribe: disk.subscribe ?? sql.subscribe,
  };
}
