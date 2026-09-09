import type { AcpClientHandle, AcpClientOptions } from '../types/client.js';
import { getAgentProvider } from '../providers/registry.js';

export interface ResolvedAgentCommand {
  command: string[];
  label: string;
  createClient: (options: AcpClientOptions) => Promise<AcpClientHandle>;
  spawnCommandForSession: (
    sessionMode: string | undefined,
    agentConfig?: Record<string, unknown> | null,
  ) => string[];
}

/** Map a backend agent type to the ACP command and client factory from its provider. */
export function resolveAgentCommand(preferredAgentType: string | null): ResolvedAgentCommand | null {
  const provider = getAgentProvider(preferredAgentType);
  if (!provider?.createClient || provider.defaultCommand.length === 0) return null;
  const command = [...provider.defaultCommand];
  return {
    command,
    label: provider.type,
    createClient: provider.createClient,
    spawnCommandForSession: (sessionMode, agentConfig) =>
      provider.buildSpawnCommand(command, sessionMode, agentConfig),
  };
}

/** Human-readable name for logs; unknown codes become title-cased kebab/snake words. */
export function getAgentTypeDisplayName(agentType: string | null | undefined): string {
  if (agentType == null || agentType === '') return 'Unknown agent';
  const known = getAgentProvider(agentType)?.displayName;
  if (known) return known;
  return agentType
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
