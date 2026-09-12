import type { McpToolCallResult } from '../../types/tools/definitions.js';

export function jsonToolResult(payload: unknown, isError = false): McpToolCallResult {
  return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }], isError };
}
