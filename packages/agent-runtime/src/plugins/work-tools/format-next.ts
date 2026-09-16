import type { WorkItem } from '@/types/work/records.js';

export function formatNextWork(sessionId: string, item: WorkItem): string {
  return [
    `Session ID: ${sessionId}`,
    'Pass this sessionId to tell_what_was_built when the work is done.',
    '',
    'Plan this work next:',
    item.title,
    item.content,
  ]
    .filter(Boolean)
    .join('\n');
}

export const NO_DRAFT_WORK =
  'No draft work is ready. Add a draft, or move one off hold to the top of the queue.';

export const NO_WORK_BACKEND = 'Work plugin is not registered.';
export const NO_ARTIFACTS =
  'Provide at least one artifact kind: ui, api, algorithm, dataModel, moduleStructure, or backend.';
