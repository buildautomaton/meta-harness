import type { AgentInstallCommand } from './types.js';
import type { GetAgentHarnessFn } from '@runtime/harnesses/types.js';

export function getAgentInstallCommand(
  agentType: string,
  getHarness: GetAgentHarnessFn,
): AgentInstallCommand | undefined {
  const harness = getHarness(agentType);
  if (!harness?.install || !harness.installDetectCommand) return undefined;
  return {
    agentType,
    detectCommand: harness.installDetectCommand,
    alternateDetectCommands: harness.installAlternateDetectCommands
      ? [...harness.installAlternateDetectCommands]
      : undefined,
    install: (ctx) => harness.install!(ctx),
  };
}

export { type AgentInstallCommand } from './types.js';
