import type { NotifierHub } from '@/types/notify.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';
import type { HttpRegistry } from '@/types/http/registry.js';

export type CommandHost = ToolRegistry & {
  cwd: string;
  notifier?: NotifierHub;
  http?: HttpRegistry;
};

/** Methods a transport plugin may override. */
export type TransportImplementation = {
  start(host: CommandHost): Promise<void> | void;
  stop(): Promise<void> | void;
};
