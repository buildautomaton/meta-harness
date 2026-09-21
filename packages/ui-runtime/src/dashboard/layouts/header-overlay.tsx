import { headerBarClass } from '../chrome.js';
import { PanelSlot } from '../panel-slot.js';
import { useUiHost } from '../host.js';

export function HeaderOverlay() {
  const { surfacesIn } = useUiHost();
  if (surfacesIn('header').length === 0) return null;
  return (
    <div className={headerBarClass}>
      <PanelSlot panel="header" />
    </div>
  );
}
