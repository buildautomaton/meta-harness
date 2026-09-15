import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { AgentRuntimePlugin } from '@/types/plugin.js';
import type { LogFn } from '@/types/log.js';

/** Host input to `createRuntime`. Engine-only fields live on `AcpEngineOptions`. */
export type RuntimeOptions = {
  cwd: string;
  plugins?: AgentRuntimePlugin[];
  log?: LogFn;
  isShutdownRequested?: () => boolean;
};

/**
 * Started host: transport `start`/`stop` plus the ACP `engine`.
 * `start` listens (MCP/remote); it does not send prompts.
 */
export type RuntimeHandle = {
  cwd: string;
  engine: AcpEngine;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};
