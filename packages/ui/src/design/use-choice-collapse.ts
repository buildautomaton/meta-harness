import { useEffect, useState } from 'react';
import { collapseAfterSelect } from './choice-collapse.js';

export function useChoiceCollapse(selectedId: string) {
  const [open, setOpen] = useState(() => collapseAfterSelect(selectedId).open);
  useEffect(() => {
    setOpen(collapseAfterSelect(selectedId).open);
  }, [selectedId]);
  return {
    open,
    collapseNow: () => setOpen(false),
    toggle: () => setOpen((value) => !value),
  };
}
