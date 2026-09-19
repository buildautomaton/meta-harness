import { PenLine } from 'lucide-react';
import { EmptyState } from '../../design/status.js';
import { DraftCard } from './draft-card.js';
import { useWork } from './context.js';
import { isDraftColumnItem } from './draft-column-item.js';

export function DraftList() {
  const { items } = useWork();
  const drafts = items.filter(isDraftColumnItem);
  if (drafts.length === 0) {
    return (
      <EmptyState
        icon={PenLine}
        title="No drafts yet"
        description="Write a prompt to queue the next piece of work."
      />
    );
  }
  return (
    <ul className="w-full divide-y divide-border pb-16">
      {drafts.map((item) => (
        <li key={item.id}>
          <DraftCard item={item} />
        </li>
      ))}
    </ul>
  );
}
