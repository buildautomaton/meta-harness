import type { ReactNode } from 'react';
import { NumberGlyph } from './number-glyph.js';

export function NumberedBlock({
  index,
  label,
  children,
}: {
  index: number;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 px-4 py-4">
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
