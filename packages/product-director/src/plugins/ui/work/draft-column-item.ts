import type { WorkItem } from './types.js';

export function isDraftColumnItem(item: Pick<WorkItem, 'status' | 'origin'>): boolean {
  return item.status === 'draft' || (item.status === 'queued' && item.origin?.kind === 'draft');
}
