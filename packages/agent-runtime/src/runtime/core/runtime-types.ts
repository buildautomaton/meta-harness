import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { AgentRuntimePlugin } from '@/types/plugin.js';
import type { LogFn } from '@/types/log.js';

export type RuntimeOptions = {
  cwd: string;
  plugins?: AgentRuntimePlugin[];
  log?: LogFn;
  isShutdownRequested?: () => boolean;
};

export type RuntimeHandle = {
  cwd: string;
  engine: AcpEngine;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};
