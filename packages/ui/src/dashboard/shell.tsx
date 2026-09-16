import { PanelSlot } from './panel-slot.js';

export function DashboardShell() {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <PanelSlot panel="nav" className="w-14 shrink-0 border-r border-border bg-card" />
      <PanelSlot panel="sidebar" className="w-80 shrink-0 border-r border-border bg-background" />
      <PanelSlot panel="main" className="min-w-0 flex-1 bg-background" />
    </div>
  );
}
