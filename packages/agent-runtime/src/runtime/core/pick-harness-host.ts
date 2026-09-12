import type { HarnessHostImplementation } from '../../types/harness/host.js';

export function pickHarnessHost(
  impl: Partial<HarnessHostImplementation>,
): HarnessHostImplementation {
  return {
    getAccessPort: impl.getAccessPort,
    mcpServers: impl.mcpServers,
    readPersistedSession: impl.readPersistedSession,
    writePersistedSession: impl.writePersistedSession,
    persistAvailableCommands: impl.persistAvailableCommands,
  };
}

/** Shared host methods are the same function refs after factory merge. */
export function hostSkipKey(impl: Partial<HarnessHostImplementation>): object | undefined {
  const fn =
    impl.writePersistedSession ??
    impl.readPersistedSession ??
    impl.persistAvailableCommands ??
    impl.getAccessPort ??
    impl.mcpServers;
  return typeof fn === 'function' ? fn : undefined;
}

export function hasHostMethods(host: HarnessHostImplementation): boolean {
  return Boolean(
    host.getAccessPort ||
      host.mcpServers ||
      host.readPersistedSession ||
      host.writePersistedSession ||
      host.persistAvailableCommands,
  );
}
