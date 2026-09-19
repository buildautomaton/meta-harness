/** Args for `HarnessImplementation.install`. */
export type AgentInstallContext = {
  authToken: string;
  onProgress?: (message: string, logOutput?: string) => void;
  env: NodeJS.ProcessEnv;
};

/**
 * Host-level harness behavior (shared across agent types).
 * Simple functions — not factories that return more functions.
 */
export type HarnessHostImplementation = {
  getAccessPort?: () => number | null;
  mcpServers?: (info: { accessPort: number | null }) => unknown[];
  readPersistedSession?: (scopeId: string) => {
    acpSessionId: string | null;
    configOptions: unknown[] | null;
  } | null;
  writePersistedSession?: (info: {
    scopeId: string;
    acpSessionId: string;
    configOptions: unknown[] | null;
    modes: unknown;
  }) => void;
  persistAvailableCommands?: (info: {
    scopeId: string;
    availableCommands: unknown[];
  }) => void;
};
