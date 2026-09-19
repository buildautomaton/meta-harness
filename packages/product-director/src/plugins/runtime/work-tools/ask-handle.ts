import { randomUUID } from 'node:crypto';
import type { ToolContext } from '@buildautomaton/runtime';
import type { McpToolCallResult } from '@buildautomaton/runtime';
import { formatDrafts, formatQueuedWork, NO_QUEUED_WORK, NO_WORK_BACKEND } from './format-next.js';
import { workFrom } from './ctx.js';

export async function handleAskWhatToWorkOn(ctx: ToolContext): Promise<McpToolCallResult> {
  const work = workFrom(ctx);
  if (!work) return text(NO_WORK_BACKEND, true);
  const sessionId = randomUUID();
  const queued = await work.pickNextWork(sessionId);
  const drafts = (await work.listWork({ status: 'draft' })).filter((item) => !item.paused);
  const parts: string[] = [];
  if (queued) parts.push(formatQueuedWork(sessionId, queued));
  else parts.push(NO_QUEUED_WORK);
  const draftBlock = formatDrafts(queued ? randomUUID() : sessionId, drafts);
  if (draftBlock) parts.push('', draftBlock);
  return text(parts.join('\n'));
}

export function text(value: string, isError = false): McpToolCallResult {
  return { content: [{ type: 'text', text: value }], isError };
}
