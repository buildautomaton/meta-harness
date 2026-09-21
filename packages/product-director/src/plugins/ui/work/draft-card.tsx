import { SentTime } from './sent-time.js';
import { AssignProjectButton } from './assign-project-button.js';
import { DraftDelete } from './draft-delete.js';
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-sm font-semibold leading-snug">{title}</p>
            <SentTime at={item.createdAt} />
          </div>
          <div className="flex shrink-0 items-center">
            <AssignProjectButton workId={item.id} project={item.project} />
            <DraftDelete id={item.id} />
          </div>
        </div>
        {showBody ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
        {item.decisions.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {item.decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <DraftQuestions item={item} />
    </article>
  );
}
