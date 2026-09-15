import type { NotifierHub } from '@/types/notify.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';

export type CommandHost = ToolRegistry & { cwd: string; notifier?: NotifierHub };

/** Methods a transport plugin may override. */
export type TransportImplementation = {
  start(host: CommandHost): Promise<void> | void;
  stop(): Promise<void> | void;
};
