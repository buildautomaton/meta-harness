export function clampSplit(
  next: number,
  bounds: { minLeft: number; maxLeft: number; minRight: number; container: number },
): number {
  const maxByRight = bounds.container - bounds.minRight;
  return Math.max(bounds.minLeft, Math.min(bounds.maxLeft, maxByRight, next));
}
