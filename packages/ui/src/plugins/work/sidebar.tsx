import { WorkComposer } from './composer.js';
import { WorkQueueView } from './queue-view.js';

export function WorkSidebar() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border px-4 py-3">
        <h1 className="text-sm font-semibold">Work</h1>
        <p className="text-xs text-muted-foreground">Drafts, in progress, and completed</p>
      </div>
      <div className="min-h-0 flex-1">
        <WorkQueueView />
      </div>
      <WorkComposer />
    </div>
  );
}
