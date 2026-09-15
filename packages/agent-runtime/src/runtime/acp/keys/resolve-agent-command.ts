import type { AcpClientHandle, AcpClientOptions } from '@runtime/acp/client-types.js';
import type { GetAgentHarnessFn } from '@runtime/harnesses/types.js';

export type { GetAgentHarnessFn };

export interface ResolvedAgentCommand {
  command: string[];
  label: string;
  createClient: (options: AcpClientOptions) => Promise<AcpClientHandle>;
  spawnCommandForSession: (
    sessionMode: string | undefined,
    agentConfig?: Record<string, unknown> | null,
  ) => string[];
}

/** Map a backend agent type to the ACP command and client factory from its harness. */
export function resolveAgentCommand(
  preferredAgentType: string | null,
  getHarness: GetAgentHarnessFn,
): ResolvedAgentCommand | null {
  const harness = getHarness(preferredAgentType);
  if (!harness?.createClient || harness.defaultCommand.length === 0) return null;
  const command = [...harness.defaultCommand];
  return {
    command,
    label: harness.type,
    createClient: harness.createClient,
    spawnCommandForSession: (sessionMode, agentConfig) =>
      harness.buildSpawnCommand(command, sessionMode, agentConfig),
  };
}

/** Human-readable name for logs; unknown codes become title-cased kebab/snake words. */
export function getAgentTypeDisplayName(
  agentType: string | null | undefined,
  getHarness: GetAgentHarnessFn,
): string {
  if (agentType == null || agentType === '') return 'Unknown agent';
  const known = getHarness(agentType)?.displayName;
  if (known) return known;
  return agentType
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
