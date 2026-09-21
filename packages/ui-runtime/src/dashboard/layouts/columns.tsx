import { NavSlot } from '../nav-slot.js';
import { ColumnSlots } from './column-slots.js';
import { HeaderOverlay } from './header-overlay.js';

export function ColumnsShell() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <HeaderOverlay />
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <NavSlot />
        <ColumnSlots />
      </div>
    </div>
  );
}
