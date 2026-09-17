import type { WorkItem } from './types.js';

export function mergeItems(current: WorkItem[], incoming: WorkItem[]): WorkItem[] {
  if (incoming.length === 0) return current;
  const byId = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) byId.set(item.id, item);
  return [...byId.values()];
}

export function isQueuedItem(item: WorkItem): boolean {
  return item.status === 'queued';
}

export function dropById(items: WorkItem[], ids: string[]): WorkItem[] {
  if (ids.length === 0) return items;
  const skip = new Set(ids);
  return items.filter((item) => !skip.has(item.id));
}
