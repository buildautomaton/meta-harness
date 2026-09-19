import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent } from 'react';
import { disableEmbedPointerEvents } from './disable-embed-pointer-events.js';

export function useSplitDrag(opts: {
  leftWidthRef: MutableRefObject<number>;
  onMove: (next: number) => void;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const onMoveRef = useRef(opts.onMove);
  onMoveRef.current = opts.onMove;

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    startX.current = event.clientX;
    startWidth.current = opts.leftWidthRef.current;
    setIsResizing(true);
  }

  useEffect(() => {
    if (!isResizing) return;
    const restore = disableEmbedPointerEvents();
    const move = (event: globalThis.PointerEvent) => {
      onMoveRef.current(startWidth.current + (event.clientX - startX.current));
    };
    const stop = () => setIsResizing(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      restore();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return { isResizing, onPointerDown };
}
