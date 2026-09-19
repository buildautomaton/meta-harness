import { fuzzyTime } from './fuzzy-time.js';
import { DraftQuestions } from './draft-questions.js';
import { draftOriginId } from './work-origin.js';
import type { WorkItem } from './types.js';

export function DraftCard({ item }: { item: WorkItem }) {
  const title = item.title.trim() || 'Draft';
  const body = item.content.trim();
  const showBody = Boolean(body) && body !== title;
  return (
    <article
      id={draftOriginId(item.id)}
      className="bg-background scroll-mt-3 transition-colors data-[origin-flash]:bg-muted"
    >
      <div className="space-y-2 px-4 py-4">
        <p className="text-sm font-semibold leading-snug">{title}</p>
        {showBody ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
        {item.decisions.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {item.decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        ) : null}
        <p className="text-xs text-muted-foreground">{fuzzyTime(item.createdAt)}</p>
      </div>
      <DraftQuestions item={item} />
    </article>
  );
}
