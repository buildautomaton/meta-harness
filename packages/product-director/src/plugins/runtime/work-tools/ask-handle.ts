import { randomUUID } from 'node:crypto';
import type { ToolContext } from '@buildautomaton/runtime';
import type { McpToolCallResult } from '@buildautomaton/runtime';
import type { WorkItem } from '@/types/work/records.js';
import { formatDrafts, formatQueuedWork, formatSessionHandle, NO_WORK_BACKEND } from './format-next.js';
import { toolText } from './tool-result.js';
import { workFrom } from './ctx.js';
import { hasQueued, listDrafts, waitUntilQueuedOrDraft } from './wait-queued.js';

export async function handleAskWhatToWorkOn(ctx: ToolContext): Promise<McpToolCallResult> {
  const work = workFrom(ctx);
  if (!work) return toolText(NO_WORK_BACKEND, { isError: true });
  const sessionId = randomUUID();
  let drafts = await listDrafts(work);
  let queued: WorkItem | null = await work.pickNextWork(sessionId);
  if (!queued && drafts.length === 0) {
    await waitUntilQueuedOrDraft(work);
    drafts = await listDrafts(work);
    if (await hasQueued(work)) queued = await work.pickNextWork(sessionId);
  }
  const interviewSessionId = queued && drafts.length ? randomUUID() : undefined;
  const parts: string[] = [];
  if (queued) parts.push(formatQueuedWork(sessionId, queued));
  else parts.push(formatSessionHandle(sessionId));
  const draftBlock = formatDrafts(interviewSessionId ?? sessionId, drafts);
  if (draftBlock) parts.push('', draftBlock);
  return toolText(parts.join('\n'), {
    structuredContent: {
      sessionId,
      ...(interviewSessionId ? { interviewSessionId } : {}),
    },
  });
}

/** @deprecated Prefer toolText — kept for call sites that only need plain text errors. */
export function text(value: string, isError = false): McpToolCallResult {
  return toolText(value, { isError });
}
