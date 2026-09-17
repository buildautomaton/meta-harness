import { WorkComposer } from './composer.js';
import { WorkFeedList } from './feed-list.js';

export function WorkFeedView() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center border-b border-border bg-background px-4">
        <h1 className="truncate text-[15px] font-semibold tracking-tight">Work</h1>
      </header>
      <WorkComposer />
      <div className="min-h-0 flex-1 overflow-y-auto bg-background">
        <WorkFeedList />
      </div>
    </div>
  );
}
