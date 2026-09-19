import type { ReactNode } from 'react';
import { NumberGlyph } from './number-glyph.js';

export function NumberedBlock({
  index,
  label,
  id,
  children,
}: {
  index: number;
  label?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className="flex gap-3 px-4 py-4 scroll-mt-3 transition-colors data-[origin-flash]:bg-muted"
    >
      <NumberGlyph>{index}</NumberGlyph>
      <div className="min-w-0 flex-1 bg-transparent">
        {label ? (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
