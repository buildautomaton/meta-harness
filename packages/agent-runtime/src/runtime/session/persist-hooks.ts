import type { SessionImplementation } from '../../types/session/implementation.js';
import type { HarnessHostImplementation } from '../../types/harness/host.js';

export async function persistHooksFromBackend(
  backend: SessionImplementation,
): Promise<HarnessHostImplementation> {
  const cache = new Map<string, { acpSessionId: string | null; configOptions: unknown[] | null }>();
  for (const row of await backend.list()) {
    cache.set(row.id, { acpSessionId: row.acpSessionId ?? null, configOptions: null });
  }
  return {
    readPersistedSession: (scopeId) => cache.get(scopeId) ?? null,
    writePersistedSession: (info) => {
      cache.set(info.scopeId, {
        acpSessionId: info.acpSessionId,
        configOptions: Array.isArray(info.configOptions) ? info.configOptions : null,
      });
      void backend.patch(info.scopeId, { acpSessionId: info.acpSessionId });
    },
  };
}
