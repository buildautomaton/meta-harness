export type AgentInstallContext = {
  authToken: string;
  onProgress?: (message: string, logOutput?: string) => void;
  env: NodeJS.ProcessEnv;
};

export type AgentInstallCommand = {
  agentType: string;
  detectCommand: string;
  /** Other binaries that satisfy a successful install (e.g. cursor-agent). */
  alternateDetectCommands?: string[];
  install(ctx: AgentInstallContext): Promise<void>;
};
