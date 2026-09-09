/** Extensible local agent harness: detect, install, spawn, ACP client. */

import type { AcpClientHandle, AcpClientOptions } from './client.js';

export type AgentInstallContext = {
  authToken: string;
  onProgress?: (message: string, logOutput?: string) => void;
  env: NodeJS.ProcessEnv;
};

export type AgentProviderInstall = {
  detectCommand: string;
  alternateDetectCommands?: string[];
  tokenEnvVar: string;
  run(ctx: AgentInstallContext): Promise<void>;
};

export type AgentProvider = {
  type: string;
  displayName: string;
  defaultCommand: readonly string[];
  authErrorHints: readonly RegExp[];
  detectPresence?: () => Promise<boolean>;
  install?: AgentProviderInstall;
  createClient?: (options: AcpClientOptions) => Promise<AcpClientHandle>;
  buildSpawnCommand: (
    base: readonly string[],
    sessionMode?: string,
    agentConfig?: Record<string, unknown> | null,
  ) => string[];
  onPromptTurnFinished?: (sessionId: string | undefined) => void;
  onSessionClosed?: (sessionId: string) => void;
};

export type AgentProviderRegistry = {
  register(provider: AgentProvider): void;
  get(agentType: string | null | undefined): AgentProvider | undefined;
  list(): readonly AgentProvider[];
  listAutoDetect(): AgentProvider[];
};
