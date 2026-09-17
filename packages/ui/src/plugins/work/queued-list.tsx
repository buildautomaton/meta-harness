import { ListTodo } from 'lucide-react';
import { EmptyState } from '../../design/status.js';
import { QueuedCard } from './queued-card.js';
import { useWork } from './context.js';
import { isQueuedItem } from './merge-items.js';

export function QueuedList() {
  const { items } = useWork();
  const queued = items.filter(isQueuedItem);
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
    <ul className="w-full divide-y divide-border pb-16">
      {queued.map((item, index) => (
        <li key={item.id}>
          <QueuedCard item={item} isFirst={index === 0} isLast={index === queued.length - 1} />
        </li>
      ))}
    </ul>
  );
}
