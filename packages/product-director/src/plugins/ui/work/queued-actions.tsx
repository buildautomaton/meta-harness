import { ArrowDownToLine, ArrowUpToLine, Pause, Play, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button, cn } from '@buildautomaton/ui-runtime';
import { useWork } from './context.js';
import { resolveWorkOrigin } from './resolve-origin.js';
import { removeQueued } from './remove-queued.js';
import type { WorkItem } from './types.js';

export function QueuedActions({
  item,
  isFirst,
  isLast,
}: {
  item: WorkItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { client, reload, artifacts, ingestItems, dropItems } = useWork();
  const patch = (body: { queue?: 'top' | 'bottom'; paused?: boolean }) => {
    void client.updateWork(item.id, body).then(reload);
  };
  const unqueue = () => {
    void removeQueued(client, item, resolveWorkOrigin(item, artifacts))
      .then((result) => {
        ingestItems(result.queued);
        dropItems(result.removed);
      })
      .finally(() => void reload());
  };
  return (
    <div className="flex shrink-0 items-center justify-end gap-0.5">
      {isFirst ? null : (
        <IconBtn label="Move to top of queue" onClick={() => patch({ queue: 'top' })}>
          <ArrowUpToLine className="h-4 w-4" />
        </IconBtn>
      )}
      {isLast ? null : (
        <IconBtn label="Move to bottom of queue" onClick={() => patch({ queue: 'bottom' })}>
          <ArrowDownToLine className="h-4 w-4" />
        </IconBtn>
      )}
      {item.paused ? (
        <IconBtn
          label="Resume"
          className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-500"
          onClick={() => patch({ paused: false })}
        >
          <Play className="h-4 w-4 fill-current" />
        </IconBtn>
      ) : (
        <IconBtn
          label="Pause"
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => patch({ paused: true })}
        >
          <Pause className="h-4 w-4 fill-current" />
        </IconBtn>
      )}
      <IconBtn
        label="Remove from queue"
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={unqueue}
      >
        <X className="h-4 w-4" />
      </IconBtn>
    </div>
  );
}

function IconBtn(props: { label: string; className?: string; onClick: () => void; children: ReactNode }) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      title={props.label}
      aria-label={props.label}
      className={cn('h-8 w-8', props.className)}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}
