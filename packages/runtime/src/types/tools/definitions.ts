export type McpToolInputSchema = Record<string, unknown>;

export type McpToolDefinition = {
  name: string;
  title?: string;
  description: string;
  inputSchema: McpToolInputSchema;
  /** Optional JSON Schema for structuredContent on tool results (MCP state handles, etc.). */
  outputSchema?: McpToolInputSchema;
};

export type McpToolCallResult = {
  content: Array<{ type: 'text'; text: string }>;
  /** Machine-readable result; use for explicit state handles the model must thread forward. */
  structuredContent?: unknown;
  isError?: boolean;
};
