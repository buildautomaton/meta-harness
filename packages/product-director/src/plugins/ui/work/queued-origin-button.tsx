import { MessageSquareQuote, PenLine } from 'lucide-react';
import { Button } from '@buildautomaton/ui-runtime';
import { useWork } from './context.js';
import { resolveWorkOrigin } from './resolve-origin.js';
import { scrollToOrigin } from './work-origin.js';
import type { WorkItem } from './types.js';

export function QueuedOriginButton({ item }: { item: WorkItem }) {
  const { artifacts } = useWork();
  const origin = resolveWorkOrigin(item, artifacts);
  const fromQuestion = origin.kind === 'question';
  const label = fromQuestion ? 'Show the review question' : 'Show the draft';
  const Icon = fromQuestion ? MessageSquareQuote : PenLine;
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      title={label}
      aria-label={label}
      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
      onClick={() => scrollToOrigin(origin)}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
