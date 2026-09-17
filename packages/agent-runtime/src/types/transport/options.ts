import type { McpToolDefinition } from '@/types/tools/definitions.js';
import type { TransportEndpoint } from './endpoints.js';

export type TransportKind = 'http' | 'stdio' | 'remote';

export type HttpTransportOptions = {
  id?: string;
  host?: string;
  port?: number;
  /** Default MCP tools path when `endpoints` has no tools mount. */
  path?: string;
  endpoints?: TransportEndpoint[];
};

export type StdioTransportOptions = { id?: string };
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
