import { Inbox } from 'lucide-react';
import { EmptyState } from '@buildautomaton/ui-runtime';
import { WorkCard } from './work-card.js';
import { useWork } from './context.js';

export function WorkFeedList() {
  const { artifacts } = useWork();
  if (artifacts.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No completed work yet"
        description="Cards appear here when an agent records what it just built."
      />
    );
  }
  return (
    <ul className="w-full divide-y divide-border pb-16">
      {artifacts.map((artifact) => (
        <li key={artifact.id}>
          <WorkCard artifact={artifact} />
        </li>
      ))}
    </ul>
  );
}
