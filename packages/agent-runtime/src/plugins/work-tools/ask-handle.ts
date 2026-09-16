import { randomUUID } from 'node:crypto';
import type { ToolContext } from '@/types/tools/implementation.js';
import type { McpToolCallResult } from '@/types/tools/definitions.js';
import { formatNextWork, NO_DRAFT_WORK, NO_WORK_BACKEND } from './format-next.js';

export async function handleAskWhatToWorkOn(ctx: ToolContext): Promise<McpToolCallResult> {
  if (!ctx.work) return text(NO_WORK_BACKEND, true);
  const sessionId = randomUUID();
  const item = await ctx.work.pickNextWork(sessionId);
  if (!item) return text(NO_DRAFT_WORK);
  return text(formatNextWork(sessionId, item));
}

export function text(value: string, isError = false): McpToolCallResult {
  return { content: [{ type: 'text', text: value }], isError };
}
