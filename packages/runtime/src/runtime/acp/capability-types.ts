/** Agent config options and slash commands from ACP handshake / updates. */

export type AgentCapabilities = {
  agentType: string;
  configOptions: unknown[] | null;
  availableCommands: unknown[] | null;
};

export type ReportAgentCapabilitiesFn = (info: {
  agentType: string;
  configOptions?: unknown[];
  availableCommands?: unknown[];
}) => void;
