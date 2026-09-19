import type { ReactNode } from 'react';

export function QuestionSet({ children }: { children: ReactNode }) {
  return (
    <div className="max-h-80 overflow-y-auto overscroll-contain divide-y divide-border/60 border-t border-border/60">
      {children}
    </div>
  );
}
