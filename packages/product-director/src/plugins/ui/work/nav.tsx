import { Layers } from 'lucide-react';
import { cn } from '@buildautomaton/ui-runtime';

export function WorkNav() {
  return (
    <div className="flex h-full flex-col items-center py-3">
      <button
        type="button"
        title="Work"
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground',
        )}
      >
        <Layers className="h-5 w-5" />
      </button>
    </div>
  );
}
