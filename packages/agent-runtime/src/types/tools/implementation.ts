import type { AgentRuntimeManager } from '../../runtime/core/manager/types.js';
import type { NotifierHub } from '../notify.js';
import type { SessionHooks } from '../session/hooks.js';
import type { SessionImplementation } from '../session/implementation.js';
import type { ToolsHooks } from './hooks.js';
import type { McpToolCallResult, McpToolDefinition } from './definitions.js';
import type { ToolsPrompt } from './prompts.js';

export type ToolCallExtras = {
  reportProgress?: (update: { message: string; progress?: number }) => void;
};

/** Passed into tools implementation methods when they are invoked. */
export type ToolContext = {
  cwd: string;
  manager: AgentRuntimeManager;
  backend: SessionImplementation;
  sessionHooks?: SessionHooks;
  toolsHooks?: ToolsHooks;
  notifier?: NotifierHub;
};

/** How a tools plugin exposes MCP tools. Context is an argument, not a factory. */
export type ToolsImplementation = {
  listTools(ctx: ToolContext): McpToolDefinition[] | Promise<McpToolDefinition[]>;
  callTool(
    name: string,
    args: Record<string, unknown>,
    ctx: ToolContext,
    extras?: ToolCallExtras,
  ): Promise<McpToolCallResult>;
  /** MCP initialize instructions. Transport does not supply this text. */
  instructions?(): string | undefined | Promise<string | undefined>;
  /** MCP prompts/list + prompts/get. Transport does not supply these. */
  prompts?(): ToolsPrompt[] | Promise<ToolsPrompt[]>;
};

/** Composed tool surface used by transports after `createRuntime`. */
export type ToolRegistry = {
  listTools: () => McpToolDefinition[] | Promise<McpToolDefinition[]>;
  callTool: (
    name: string,
    args: Record<string, unknown>,
    extras?: ToolCallExtras,
  ) => Promise<McpToolCallResult>;
  instructions?: () => string | undefined | Promise<string | undefined>;
  prompts?: () => ToolsPrompt[] | Promise<ToolsPrompt[]>;
};
