import { useEffect, useRef, useState, type ReactNode } from 'react';
import { clampSplit } from './split-clamp.js';
import { readPref, writePref } from './split-prefs.js';
import { SplitHandle } from './split-handle.js';
import { SplitShield } from './split-shield.js';
import { useSplitDrag } from './use-split-drag.js';
import { useSplitHandleRect } from './use-split-handle-rect.js';

export function SplitPanel(props: {
  left: ReactNode;
  right: ReactNode;
  defaultLeftWidth: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  minRightWidth?: number;
  preferenceKey?: string;
}) {
  const minLeft = props.minLeftWidth ?? 240;
  const maxLeft = props.maxLeftWidth ?? 2400;
  const minRight = props.minRightWidth ?? 240;
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(
    () => (props.preferenceKey ? readPref(props.preferenceKey) : undefined) ?? props.defaultLeftWidth,
  );
  const leftWidthRef = useRef(leftWidth);
  leftWidthRef.current = leftWidth;

  function apply(next: number) {
    const measured = containerRef.current?.getBoundingClientRect().width ?? 0;
    const clamped =
      measured > 0 ? clampSplit(next, { minLeft, maxLeft, minRight, container: measured }) : next;
    setLeftWidth(clamped);
    if (props.preferenceKey) writePref(props.preferenceKey, clamped);
  }

  useEffect(() => {
    if (props.preferenceKey && readPref(props.preferenceKey) != null) return;
    apply(props.defaultLeftWidth);
  }, [props.defaultLeftWidth, props.preferenceKey]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => apply(leftWidthRef.current));
    ro.observe(el);
    return () => ro.disconnect();
  }, [minLeft, maxLeft, minRight, props.preferenceKey]);

  const drag = useSplitDrag({ leftWidthRef, onMove: apply });
  const handleRect = useSplitHandleRect(leftRef, leftWidth);

  return (
    <div ref={containerRef} className="relative flex h-full min-h-0 min-w-0 w-full overflow-hidden">
      <div
        ref={leftRef}
        className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden"
        style={{ width: leftWidth }}
      >
        {props.left}
      </div>
      <SplitHandle active={drag.isResizing} rect={handleRect} onPointerDown={drag.onPointerDown} />
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-border">
        {props.right}
      </div>
      <SplitShield active={drag.isResizing} />
    </div>
  );
}
