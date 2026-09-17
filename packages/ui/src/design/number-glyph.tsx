import type { ReactNode } from 'react';

export function NumberGlyph({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold tabular-nums text-primary-foreground">
      {children}
    </div>
  );
}
