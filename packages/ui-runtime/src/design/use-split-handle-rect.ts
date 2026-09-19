import { useLayoutEffect, useState, type RefObject } from 'react';

export type SplitHandleRect = { top: number; left: number; height: number };

export function useSplitHandleRect(
  leftRef: RefObject<HTMLElement | null>,
  leftWidth: number,
): SplitHandleRect | null {
  const [rect, setRect] = useState<SplitHandleRect | null>(null);
  useLayoutEffect(() => {
    const el = leftRef.current;
    if (!el) return;
    const update = () => {
      const box = el.getBoundingClientRect();
      setRect({ top: box.top, left: box.right, height: box.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [leftRef, leftWidth]);
  return rect;
}
