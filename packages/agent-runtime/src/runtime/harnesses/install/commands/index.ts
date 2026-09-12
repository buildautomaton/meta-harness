import type { AgentInstallCommand } from './types.js';
import { getAgentHarness } from '../../registry.js';

export function getAgentInstallCommand(agentType: string): AgentInstallCommand | undefined {
  const harness = getAgentHarness(agentType);
  if (!harness?.install || !harness.installDetectCommand) return undefined;
  return {
    agentType,
    detectCommand: harness.installDetectCommand,
    alternateDetectCommands: harness.installAlternateDetectCommands ? [...harness.installAlternateDetectCommands] : undefined,
    install: (ctx) => harness.install!(ctx),
  };
}

export { type AgentInstallCommand } from './types.js';
