import { SentTime } from './sent-time.js';
import { AssignProjectButton } from './assign-project-button.js';
import type { WorkArtifact } from './types.js';

export function WorkCardHeader({ artifact }: { artifact: WorkArtifact }) {
  return (
    <header className="px-4 pb-2 pt-4">
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="min-w-0 truncate text-[17px] font-semibold tracking-tight">
          {artifact.title.trim() || 'Unnamed'}
        </h2>
        <SentTime at={artifact.createdAt} />
        <div className="ml-auto">
          <AssignProjectButton artifactId={artifact.id} project={artifact.project} />
        </div>
      </div>
    </header>
  );
}
