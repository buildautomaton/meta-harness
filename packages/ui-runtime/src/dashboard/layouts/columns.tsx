import { NavSlot } from '../nav-slot.js';
import { ColumnSlots } from './column-slots.js';
import { HeaderOverlay } from './header-overlay.js';

export function ColumnsShell() {
  return (
    <div className="relative flex h-full min-h-0 w-full overflow-hidden">
      <NavSlot />
      <ColumnSlots />
      <HeaderOverlay />
    </div>
  );
}
