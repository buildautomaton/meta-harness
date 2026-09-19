import { PanelSlot } from '../panel-slot.js';
import { NavSlot } from '../nav-slot.js';
import { sidebarPaneClass } from '../chrome.js';

export function SidebarShell() {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <NavSlot />
      <PanelSlot panel="sidebar" className={sidebarPaneClass} />
      <PanelSlot panel="main" className="min-h-0 min-w-0 flex-1 overflow-hidden bg-background" />
    </div>
  );
}
