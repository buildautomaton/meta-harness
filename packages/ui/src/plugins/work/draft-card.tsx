import { fuzzyTime } from './fuzzy-time.js';
import type { WorkItem } from './types.js';

export function DraftCard({ item }: { item: WorkItem }) {
  const title = item.title.trim() || 'Draft';
  const body = item.content.trim();
  const showBody = Boolean(body) && body !== title;
  return (
    <article className="space-y-2 px-4 py-4">
      <p className="text-sm font-semibold leading-snug">{title}</p>
      {showBody ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
      <p className="text-xs text-muted-foreground">{fuzzyTime(item.createdAt)}</p>
    </article>
  );
}
