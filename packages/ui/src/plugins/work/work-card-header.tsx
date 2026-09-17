import { fuzzyTime } from './fuzzy-time.js';
import type { WorkArtifact } from './types.js';

export function WorkCardHeader({ artifact }: { artifact: WorkArtifact }) {
  return (
    <header className="px-4 pb-2 pt-4">
      <h2 className="truncate text-[17px] font-semibold tracking-tight">
        {artifact.title.trim() || 'Unnamed'}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{fuzzyTime(artifact.createdAt)}</p>
    </header>
  );
}
