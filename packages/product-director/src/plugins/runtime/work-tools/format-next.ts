import type { WorkItem } from '@/types/work/records.js';

export function formatSessionHandle(sessionId: string): string {
  return [
    `Session ID: ${sessionId}`,
    'This sessionId is an MCP state handle in structuredContent. Pass it as sessionId on tell_product_director_what_was_built.',
    'Reuse this same sessionId on every tell in this agent session. Do not invent a new one or ask again just to get another.',
  ].join('\n');
}

export function formatQueuedWork(sessionId: string, item: WorkItem): string {
  return [
    formatSessionHandle(sessionId),
    'Pass the same project name on that tell call.',
    '',
    'Implement this queued work next:',
    item.title,
    item.project && `Project: ${item.project}`,
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
    item.project && `  Project: ${item.project}`,
    item.content && `  ${item.content.split('\n')[0]}`,
    item.decisions.length ? `  Decisions: ${item.decisions.join('; ')}` : '',
  ]);
  return [
    `Interview session ID: ${sessionId}`,
    'Also returned as interviewSessionId in structuredContent when distinct from sessionId.',
    'Drafts to interview. Ask exactly one question per call until the plan is sharp.',
    'Call ask_product_director_interview_questions with workId, this sessionId, and a single multiple-choice question (2–6 options, one recommended, include Something else).',
    'Capture each answer as a decision. When done, pass questions: [] to queue — or the user may accept the draft from the dashboard.',
    '',
    ...lines.filter(Boolean),
  ].join('\n');
}

export const NO_WORK_BACKEND = 'Work plugin is not registered.';
export const NO_ARTIFACTS =
  'Provide at least one registered artifact kind for the product director.';
