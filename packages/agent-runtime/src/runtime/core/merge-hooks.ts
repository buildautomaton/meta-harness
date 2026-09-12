import type { HarnessHooks } from '../../types/harness/hooks.js';
import type { HarnessHostImplementation } from '../../types/harness/host.js';

function both<A extends unknown[]>(
  a?: (...args: A) => void,
  b?: (...args: A) => void,
): ((...args: A) => void) | undefined {
  if (!a) return b;
  if (!b) return a;
  return (...args) => {
    a(...args);
    b(...args);
  };
}

export function mergeHarnessHooks(persist: HarnessHooks, extra?: HarnessHooks): HarnessHooks {
  if (!extra) return persist;
  return {
    onSessionUpdate: both(persist.onSessionUpdate, extra.onSessionUpdate),
    onRequest: both(persist.onRequest, extra.onRequest),
    onFileChange: both(persist.onFileChange, extra.onFileChange),
  };
}

export function mergeHarnessHost(
  persist: HarnessHostImplementation,
  extra?: HarnessHostImplementation,
): HarnessHostImplementation {
  if (!extra) return persist;
  return {
    getAccessPort: extra.getAccessPort ?? persist.getAccessPort,
    mcpServers: extra.mcpServers ?? persist.mcpServers,
    readPersistedSession: extra.readPersistedSession ?? persist.readPersistedSession,
    writePersistedSession: both(persist.writePersistedSession, extra.writePersistedSession),
    persistAvailableCommands: both(
      persist.persistAvailableCommands,
      extra.persistAvailableCommands,
    ),
  };
}

export function mergeOptional<T extends object>(base?: T, extra?: T): T | undefined {
  if (!base) return extra;
  if (!extra) return base;
  return { ...base, ...extra };
}

export function addHooksOnce<T extends object>(
  seen: WeakSet<object>,
  current: T | undefined,
  hooks: T,
  merge: (base: T, extra: T) => T,
): T {
  if (seen.has(hooks)) return current ?? hooks;
  seen.add(hooks);
  return current ? merge(current, hooks) : hooks;
}
