import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { NotifierHub } from '@/types/notify.js';
import type { SessionHooks } from '@/types/session/hooks.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { ToolsHooks } from './hooks.js';
import type { McpToolCallResult, McpToolDefinition } from './definitions.js';
import type { ToolsPrompt } from './prompts.js';

export type ToolCallExtras = {
  reportProgress?: (update: { message: string; progress?: number }) => void;
};

/** Passed into tools implementation methods when they are invoked. */
export type ToolContext = {
  cwd: string;
  engine: AcpEngine;
  backend: SessionImplementation;
  sessionHooks?: SessionHooks;
  toolsHooks?: ToolsHooks;
  notifier?: NotifierHub;
  extras: Record<string, unknown>;
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
  instructions?(ctx: ToolContext): string | undefined | Promise<string | undefined>;
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
