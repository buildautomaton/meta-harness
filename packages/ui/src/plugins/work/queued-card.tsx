import { fuzzyTime } from './fuzzy-time.js';
import { QueuedActions } from './queued-actions.js';
import type { WorkItem } from './types.js';

export function QueuedCard({
  item,
  isFirst,
  isLast,
}: {
  item: WorkItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const title = item.title.trim() || 'Queued work';
  return (
    <article className="space-y-3 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-snug">{title}</p>
        <QueuedActions item={item} isFirst={isFirst} isLast={isLast} />
      </div>
      {item.prompt ? <Labeled text={item.prompt} label="Prompt" /> : null}
      {item.decisions[0] ? <Labeled text={item.decisions.join('\n')} label="Answer" /> : null}
      {item.agentContext ? <Labeled text={item.agentContext} label="Agent context" /> : null}
      <p className="text-xs text-muted-foreground">{item.paused ? 'Paused · ' : ''}{fuzzyTime(item.createdAt)}</p>
    </article>
  );
}

function Labeled({ label, text }: { label: string; text: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
    </div>
  );
}
