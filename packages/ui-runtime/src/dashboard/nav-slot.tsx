import { PanelSlot } from './panel-slot.js';
import { navRailClass } from './chrome.js';

export function NavSlot() {
  return <PanelSlot panel="nav" className={navRailClass} />;
}
