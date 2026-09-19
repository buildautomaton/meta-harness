import { PanelSlot } from '../panel-slot.js';
import { NavSlot } from '../nav-slot.js';
import { masterPaneClass } from '../chrome.js';

export function MasterDetailShell() {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <NavSlot />
      <PanelSlot panel="master" className={masterPaneClass} />
      <PanelSlot panel="detail" className="min-h-0 min-w-0 flex-1 overflow-hidden bg-background" />
    </div>
  );
}
