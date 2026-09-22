import { ChevronDown, ChevronUp, MessagesSquare } from 'lucide-react';

export function FeedThreadToggle({
  count,
  open,
  onToggle,
}: {
  count: number;
  open: boolean;
  onToggle: () => void;
}) {
  const label = open
    ? 'Hide earlier in this session'
    : count === 1
      ? '1 earlier in this session'
      : `${count} earlier in this session`;
  const Chevron = open ? ChevronDown : ChevronUp;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      <MessagesSquare className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{label}</span>
      <Chevron className="ml-auto h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
