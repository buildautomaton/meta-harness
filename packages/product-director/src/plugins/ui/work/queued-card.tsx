import { useState } from 'react';
import { fuzzyTime } from './fuzzy-time.js';
import { QueuedActions } from './queued-actions.js';
import { QueuedExpand } from './queued-expand.js';
import { QueuedLabeled } from './queued-labeled.js';
import { QueuedOriginButton } from './queued-origin-button.js';
import { isPromptQueued, queuedAnswer } from './queued-prompt.js';
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
  const [open, setOpen] = useState(false);
  const title = item.title.trim() || 'Queued work';
  const answer = queuedAnswer(item);
  const collapsible = isPromptQueued(item);
  const details = Boolean(item.prompt.trim() || item.agentContext.trim());
  return (
    <article className="space-y-3 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <QueuedOriginButton item={item} />
          <p className="text-sm font-semibold leading-snug">{title}</p>
        </div>
        <QueuedActions item={item} isFirst={isFirst} isLast={isLast} />
      </div>
      {answer ? <QueuedLabeled text={answer} label="Answer" /> : null}
      {collapsible && open ? (
        <>
          {item.prompt ? <QueuedLabeled text={item.prompt} label="Prompt" /> : null}
          {item.agentContext ? <QueuedLabeled text={item.agentContext} label="Agent context" /> : null}
        </>
      ) : null}
      {collapsible && details ? <QueuedExpand open={open} onToggle={() => setOpen((v) => !v)} /> : null}
      <p className="text-xs text-muted-foreground">{item.paused ? 'Paused · ' : ''}{fuzzyTime(item.createdAt)}</p>
    </article>
  );
}
