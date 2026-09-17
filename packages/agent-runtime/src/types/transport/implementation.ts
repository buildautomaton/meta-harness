import type { NotifierHub } from '@/types/notify.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';
import type { WorkImplementation } from '@/types/work/implementation.js';

export type TransportPlugins = {
  work: Record<string, WorkImplementation>;
};

export type CommandHost = ToolRegistry & {
  cwd: string;
  notifier?: NotifierHub;
  plugins?: TransportPlugins;
};

/** Methods a transport plugin may override. */
export type TransportImplementation = {
  start(host: CommandHost): Promise<void> | void;
  stop(): Promise<void> | void;
};
