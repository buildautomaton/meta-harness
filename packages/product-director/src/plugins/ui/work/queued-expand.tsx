import { ChevronDown } from 'lucide-react';
import { cn } from '@buildautomaton/ui-runtime';

export function QueuedExpand({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      {open ? 'Show less' : 'Show prompt'}
      <ChevronDown
        className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
        aria-hidden
      />
    </button>
  );
}
