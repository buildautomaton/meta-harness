import type { AgentRuntimeManager } from '../../runtime/core/manager/types.js';
import type { SessionHooks } from '../session/hooks.js';
import type { SessionImplementation } from '../session/implementation.js';
import type { ToolsHooks } from './hooks.js';
import type { McpToolCallResult, McpToolDefinition } from './definitions.js';

/** Passed into tools implementation methods when they are invoked. */
export type ToolContext = {
  cwd: string;
  manager: AgentRuntimeManager;
  backend: SessionImplementation;
  sessionHooks?: SessionHooks;
  toolsHooks?: ToolsHooks;
};

/** How a tools plugin exposes MCP tools. Context is an argument, not a factory. */
export type ToolsImplementation = {
  listTools(ctx: ToolContext): McpToolDefinition[] | Promise<McpToolDefinition[]>;
  callTool(
    name: string,
    args: Record<string, unknown>,
    ctx: ToolContext,
  ): Promise<McpToolCallResult>;
};

/** Composed tool surface used by transports after `createRuntime`. */
export type ToolRegistry = {
  listTools: () => McpToolDefinition[] | Promise<McpToolDefinition[]>;
  callTool: (name: string, args: Record<string, unknown>) => Promise<McpToolCallResult>;
};
