import type { WorkItem } from '@/types/work/records.js';

export function formatQueuedWork(sessionId: string, item: WorkItem): string {
  return [
    `Session ID: ${sessionId}`,
    'Pass this sessionId to tell_product_director_what_was_built when the work is done.',
    '',
    'Implement this queued work next:',
    item.title,
    item.prompt && `Prompt:\n${item.prompt}`,
    item.decisions.length ? `Decisions:\n${item.decisions.map((d) => `- ${d}`).join('\n')}` : '',
    item.agentContext && `Agent context:\n${item.agentContext}`,
    item.content,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatDrafts(sessionId: string, drafts: WorkItem[]): string {
  if (drafts.length === 0) return '';
  const lines = drafts.flatMap((item) => [
    `- workId ${item.id}: ${item.title}`,
    item.content && `  ${item.content.split('\n')[0]}`,
    item.decisions.length ? `  Decisions: ${item.decisions.join('; ')}` : '',
  ]);
  return [
    `Interview session ID: ${sessionId}`,
    'Drafts to interview. Run a relentless interview until the plan is sharp.',
    'Call ask_product_director_interview_questions with workId, this sessionId, and 2–4 multiple-choice questions.',
    'Capture each answer as a decision. When you have no more questions, call with questions: [].',
    '',
    ...lines.filter(Boolean),
  ].join('\n');
}

export const NO_QUEUED_WORK = 'No queued implementation work.';
export const NO_DRAFT_WORK =
  'No draft work is ready. Add a draft, or move one off hold to the top of the queue.';
export const NO_WORK_BACKEND = 'Work plugin is not registered.';
export const NO_ARTIFACTS =
  'Provide at least one registered artifact kind for the product director.';
