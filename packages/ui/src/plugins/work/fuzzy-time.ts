export function fuzzyTime(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(delta / 60_000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}
