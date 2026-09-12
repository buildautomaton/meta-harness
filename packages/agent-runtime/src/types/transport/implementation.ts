import type { ToolRegistry } from '../tools/implementation.js';

export type CommandHost = ToolRegistry & { cwd: string };

/** Methods a transport plugin may override. */
export type TransportImplementation = {
  start(host: CommandHost): Promise<void> | void;
  stop(): Promise<void> | void;
};
