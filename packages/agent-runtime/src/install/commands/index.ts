import type { AgentInstallCommand } from './types.js';
import { getAgentProvider } from '../../providers/registry.js';

export function getAgentInstallCommand(agentType: string): AgentInstallCommand | undefined {
  const install = getAgentProvider(agentType)?.install;
  if (!install) return undefined;
  return {
    agentType,
    detectCommand: install.detectCommand,
    alternateDetectCommands: install.alternateDetectCommands,
    install: (ctx) => install.run(ctx),
  };
}

export { type AgentInstallCommand, type AgentInstallContext } from './types.js';
