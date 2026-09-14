import { jsonRpcError, jsonRpcResult, type JsonRpcMessage } from './jsonrpc.js';
import type { ToolsPrompt } from '../../../types/tools/prompts.js';

export function listMcpPrompts(id: JsonRpcMessage['id'], prompts: ToolsPrompt[]): JsonRpcMessage {
  return jsonRpcResult(id, {
    prompts: prompts.map(({ name, title, description }) => ({ name, title, description })),
  });
}

export function getMcpPrompt(
  id: JsonRpcMessage['id'],
  params: Record<string, unknown>,
  prompts: ToolsPrompt[],
): JsonRpcMessage {
  const name = typeof params.name === 'string' ? params.name : '';
  const prompt = name ? prompts.find((item) => item.name === name) : prompts[0];
  if (!prompt) return jsonRpcError(id, -32602, name ? `Unknown prompt: ${name}` : 'No prompts');
  return jsonRpcResult(id, {
    description: prompt.description,
    messages: [{ role: 'user', content: { type: 'text', text: prompt.text } }],
  });
}
