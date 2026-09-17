import { headerOverlayClass } from '../chrome.js';
import { PanelSlot } from '../panel-slot.js';
import { useUiHost } from '../host.js';

export function HeaderOverlay() {
  const { surfacesIn } = useUiHost();
  if (surfacesIn('header').length === 0) return null;
  return (
    <div className={headerOverlayClass}>
      <PanelSlot panel="header" />
    </div>
  );
}
