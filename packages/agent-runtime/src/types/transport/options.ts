import type { McpToolDefinition } from '../tools/definitions.js';

export type TransportKind = 'mcp' | 'remote';
export type McpTransportOptions = { id?: string };
export type RemoteTransportOptions = { id?: string };

export type RemoteCommand = {
  id: string;
  type: string;
  name?: string;
  params?: Record<string, unknown>;
};

/** Remote control-plane methods. Call `unsubscribe` instead of returning a closer. */
export type RemoteTransportImplementation = {
  register(info: { cwd: string; tools: McpToolDefinition[] }): Promise<void>;
  subscribe(handler: (cmd: RemoteCommand) => Promise<unknown>): Promise<void>;
  unsubscribe(): void | Promise<void>;
  publish?(event: { sessionId?: string; type: string; payload: unknown }): void;
};
