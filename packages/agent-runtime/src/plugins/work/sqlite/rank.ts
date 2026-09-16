export function isoNow(): string {
  return new Date().toISOString();
}

export const PRIORITY_RANK: Record<string, number> = { high: 3, medium: 2, low: 1 };

export function queueRank(priority: string, held: boolean): number {
  return held ? 0 : (PRIORITY_RANK[priority] ?? 2);
}
