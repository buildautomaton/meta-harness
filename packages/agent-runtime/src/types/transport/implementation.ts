import type { NotifierHub } from '@/types/notify.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';

import type { IncomingMessage, ServerResponse } from 'node:http';

export type HttpExtraHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => boolean | Promise<boolean>;

export type CommandHost = ToolRegistry & {
  cwd: string;
  notifier?: NotifierHub;
  handleHttp?: HttpExtraHandler;
};

/** Methods a transport plugin may override. */
export type TransportImplementation = {
  start(host: CommandHost): Promise<void> | void;
  stop(): Promise<void> | void;
};
