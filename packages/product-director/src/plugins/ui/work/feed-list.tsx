import { Inbox } from 'lucide-react';
import { EmptyState } from '@buildautomaton/ui-runtime';
import { WorkCard } from './work-card.js';
import { useWork } from './context.js';
import { sameProject } from './project-name.js';
import { workListClass } from './work-list-class.js';

export function WorkFeedList() {
  const { artifacts, project } = useWork();
  const visible = artifacts.filter((artifact) => sameProject(artifact.project, project));
  if (visible.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No completed work yet"
        description="Cards appear here when an agent records what it just built."
      />
    );
  }
  return (
    <ul className={workListClass}>
      {visible.map((artifact) => (
        <li key={artifact.id}>
          <WorkCard artifact={artifact} />
        </li>
      ))}
    </ul>
  );
}
