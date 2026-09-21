import type { ToolContext } from '@buildautomaton/runtime';
import type { McpToolCallResult } from '@buildautomaton/runtime';
import type { DesignQuestion } from '@/types/work/questions.js';
import { parseQuestionList } from './parse-parts.js';
import { NO_WORK_BACKEND } from './format-next.js';
import { text } from './ask-handle.js';
import { workFrom } from './ctx.js';

export async function handleAskInterviewQuestions(
  args: Record<string, unknown>,
  ctx: ToolContext,
): Promise<McpToolCallResult> {
  const work = workFrom(ctx);
  if (!work) return text(NO_WORK_BACKEND, true);
  const workId = typeof args.workId === 'string' ? args.workId : '';
  if (!workId) return text('workId is required', true);
  if (!Array.isArray(args.questions)) {
    return text('questions is required (pass [] when the interview is done)', true);
  }
  const questions = parseQuestionList(args.questions, 4) ?? [];
  if (args.questions.length > 0 && questions.length === 0) {
    return text('Each question needs id, prompt, context, and at least two choices', true);
  }
  const sessionId = typeof args.sessionId === 'string' ? args.sessionId : undefined;
  try {
    const round = await work.submitInterview(workId, questions as DesignQuestion[], sessionId);
    if (!round.item) return text('This draft was deleted. Skip it and continue.');
    if (round.done) return text(`Interview complete. Queued "${round.item.title}" for implementation.`);
    const lines = (round.answers ?? []).map((a) => `- ${a.prompt} → ${a.label}`);
    return text(['Answers recorded as decisions. Keep interviewing, or pass questions: [] to queue.', ...lines].join('\n'));
  } catch (err) {
    return text(err instanceof Error ? err.message : String(err), true);
  }
}
