import { createPortal } from 'react-dom';
import { useState, type PointerEvent } from 'react';
import { cn } from './cn.js';
import type { SplitHandleRect } from './use-split-handle-rect.js';

const HIT = 20;

export function SplitHandle(props: {
  active: boolean;
  rect: SplitHandleRect | null;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
}) {
  const [hover, setHover] = useState(false);
  const on = props.active || hover;
  if (!props.rect) return null;
  return createPortal(
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize columns"
      onPointerDown={props.onPointerDown}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      tabIndex={0}
      className="fixed z-10 flex items-stretch justify-center"
      style={{
        top: props.rect.top,
        left: props.rect.left - HIT / 2,
        width: HIT,
        height: props.rect.height,
        zIndex: props.active ? 110 : 10,
        cursor: 'col-resize',
        touchAction: 'none',
      }}
    >
      <span className="sr-only">Resize columns</span>
      <div
        className={cn(
          'h-full w-px bg-border transition-[width,background-color] duration-150',
          on && 'w-0.5 bg-primary/60',
        )}
      />
    </div>,
    document.body,
  );
}
