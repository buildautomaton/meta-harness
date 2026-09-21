import { PenLine } from 'lucide-react';
import { EmptyState } from '@buildautomaton/ui-runtime';
import { DraftCard } from './draft-card.js';
import { useWork } from './context.js';
import { isDraftColumnItem } from './draft-column-item.js';
import { sameProject } from './project-name.js';

export function DraftList() {
  const { items, project } = useWork();
  const drafts = items.filter((item) => isDraftColumnItem(item) && sameProject(item.project, project));
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
    <ul className="w-full divide-y divide-foreground/20 pb-16">
      {drafts.map((item) => (
        <li key={item.id}>
          <DraftCard item={item} />
        </li>
      ))}
    </ul>
  );
}
