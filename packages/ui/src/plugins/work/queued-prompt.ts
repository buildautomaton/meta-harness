import type { WorkItem } from './types.js';

export function isPromptQueued(item: Pick<WorkItem, 'prompt' | 'origin'>): boolean {
  return item.origin?.kind === 'question' || Boolean(item.prompt.trim());
}

export function queuedAnswer(item: Pick<WorkItem, 'decisions'>): string {
  return item.decisions.join('\n').trim();
}
