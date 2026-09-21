import { ListTodo } from 'lucide-react';
import { EmptyState } from '@buildautomaton/ui-runtime';
import { QueuedCard } from './queued-card.js';
import { useWork } from './context.js';
import { isQueuedItem } from './merge-items.js';
import { sameProject } from './project-name.js';

export function QueuedList() {
  const { items, project } = useWork();
  const allQueued = items.filter(isQueuedItem);
  const queued = allQueued.filter((item) => sameProject(item.project, project));
  if (queued.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title="Nothing queued"
        description="Answered questions and finished interviews land here for an agent to pick up."
      />
    );
  }
  return (
    <ul className="w-full divide-y divide-foreground/20 pb-16">
      {queued.map((item) => (
        <li key={item.id}>
          <QueuedCard
            item={item}
            isFirst={item.id === allQueued[0]?.id}
            isLast={item.id === allQueued[allQueued.length - 1]?.id}
          />
        </li>
      ))}
    </ul>
  );
}
