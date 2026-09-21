import { Children, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@buildautomaton/ui-runtime';
import { QUESTION_PREVIEW, visibleQuestions } from './visible-questions.js';

export function QuestionSet({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const items = Children.toArray(children);
  const extra = items.length - QUESTION_PREVIEW;
  return (
    <div className="divide-y divide-border/60 border-t border-border/60">
      {visibleQuestions(items, open)}
      {extra > 0 ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {open ? 'Show less' : `Show ${extra} more`}
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
