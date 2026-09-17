import type { ReactNode } from 'react';

export function NumberGlyph({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tabular-nums text-foreground dark:bg-black/35">
      {children}
    </div>
  );
}
