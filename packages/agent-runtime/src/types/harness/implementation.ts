import type { AcpClientHandle, AcpClientOptions } from '../../runtime/harnesses/client-types.js';
import type { AgentInstallContext, HarnessHostImplementation } from './host.js';

/**
 * Methods a harness plugin may override.
 * `createClient` returns a live ACP session handle (stateful subprocess).
 */
export type HarnessImplementation = HarnessHostImplementation & {
  detectPresence?: () => Promise<boolean>;
  install?: (ctx: AgentInstallContext) => Promise<void>;
  createClient?: (options: AcpClientOptions) => Promise<AcpClientHandle>;
  buildSpawnCommand: (
    base: readonly string[],
    sessionMode?: string,
    agentConfig?: Record<string, unknown> | null,
  ) => string[];
  onPromptTurnFinished?: (sessionId: string | undefined) => void;
  onSessionClosed?: (sessionId: string) => void;
};
