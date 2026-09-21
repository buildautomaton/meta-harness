import { fuzzyTime } from './fuzzy-time.js';

export function SentTime({ at, paused }: { at: string; paused?: boolean }) {
  return (
    <span className="shrink-0 text-xs font-normal text-muted-foreground">
      {paused ? 'Paused · ' : ''}
      {fuzzyTime(at)}
    </span>
  );
}
