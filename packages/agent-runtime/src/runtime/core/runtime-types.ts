import type { AgentRuntimeManager } from './manager/types.js';
import type { AgentRuntimePlugin } from '../../types/plugin.js';
import type { LogFn } from '../../types/log.js';

export type RuntimeOptions = {
  cwd: string;
  plugins?: AgentRuntimePlugin[];
  log?: LogFn;
  isShutdownRequested?: () => boolean;
};

export type RuntimeHandle = {
  cwd: string;
  manager: AgentRuntimeManager;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};
