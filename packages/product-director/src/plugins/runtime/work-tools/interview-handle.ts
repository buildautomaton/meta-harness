import type { ToolContext } from '@buildautomaton/runtime';
import type { McpToolCallResult } from '@buildautomaton/runtime';
import type { DesignQuestion } from '@/types/work/questions.js';
import { parseQuestionList } from './parse-parts.js';
import { NO_WORK_BACKEND } from './format-next.js';
import { toolText } from './tool-result.js';
import { workFrom } from './ctx.js';

export async function handleAskInterviewQuestions(
  args: Record<string, unknown>,
  ctx: ToolContext,
): Promise<McpToolCallResult> {
  const work = workFrom(ctx);
  if (!work) return toolText(NO_WORK_BACKEND, { isError: true });
  const workId = typeof args.workId === 'string' ? args.workId : '';
  if (!workId) return toolText('workId is required', { isError: true });
  if (!Array.isArray(args.questions)) {
    return toolText('questions is required (pass [] when the interview is done)', { isError: true });
  }
  const questions = parseQuestionList(args.questions, 4) ?? [];
  if (args.questions.length > 0 && questions.length === 0) {
    return toolText('Each question needs id, prompt, context, and at least two choices', { isError: true });
  }
  const sessionId = typeof args.sessionId === 'string' ? args.sessionId : undefined;
  try {
    const round = await work.submitInterview(workId, questions as DesignQuestion[], sessionId);
    if (!round.item) return toolText('This draft was deleted. Skip it and continue.');
    if (round.done) {
      return toolText(`Interview complete. Queued "${round.item.title}" for implementation.`, {
        structuredContent: { done: true, ...(sessionId ? { sessionId } : {}) },
      });
    }
    const lines = (round.answers ?? []).map((a) => `- ${a.prompt} → ${a.label}`);
    return toolText(
      ['Answers recorded as decisions. Keep interviewing, or pass questions: [] to queue.', ...lines].join('\n'),
      { structuredContent: { done: false, ...(sessionId ? { sessionId } : {}) } },
    );
  } catch (err) {
    return toolText(err instanceof Error ? err.message : String(err), { isError: true });
  }
}
