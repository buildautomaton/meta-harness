import { PenLine } from 'lucide-react';
import { EmptyState } from '../../design/status.js';
import { DraftCard } from './draft-card.js';
import { useWork } from './context.js';
import type { WorkItem } from './types.js';

function isOpenDraft(item: WorkItem): boolean {
  return item.status === 'draft';
}

export function DraftList() {
  const { items } = useWork();
  const drafts = items.filter(isOpenDraft);
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
