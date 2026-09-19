import { useLayoutEffect, useRef, useState } from 'react';
import { useUiHost } from '../host.js';
import { SplitColumns } from './split-columns.js';

const MIN = 240;

export function ColumnSlots() {
  const { surfacesIn } = useUiHost();
  const columns = surfacesIn('column');
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || columns.length === 0) return;
    setWidth(Math.max(MIN, Math.floor(el.getBoundingClientRect().width / columns.length)));
  }, [columns.length]);

  return (
    <div ref={ref} className="min-h-0 min-w-0 flex-1 overflow-hidden">
      {width != null ? <SplitColumns panes={columns} defaultWidth={width} /> : null}
    </div>
  );
}
