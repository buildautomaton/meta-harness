export type McpToolInputSchema = Record<string, unknown>;

export type McpToolDefinition = {
  name: string;
  description: string;
  inputSchema: McpToolInputSchema;
};

export type McpToolCallResult = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};
