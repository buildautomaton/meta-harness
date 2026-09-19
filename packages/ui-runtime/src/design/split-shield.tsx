import { createPortal } from 'react-dom';

/** Covers the viewport so iframes cannot steal pointer events during a split resize. */
export function SplitShield({ active }: { active: boolean }) {
  if (!active) return null;
  return createPortal(
    <div aria-hidden className="fixed inset-0 z-[100] cursor-col-resize" style={{ touchAction: 'none' }} />,
    document.body,
  );
}
