import type { AgentInstallContext } from '../../../../types/harness/host.js';

export type AgentInstallCommand = {
  agentType: string;
  detectCommand: string;
  alternateDetectCommands?: readonly string[];
  install(ctx: AgentInstallContext): Promise<void>;
};
