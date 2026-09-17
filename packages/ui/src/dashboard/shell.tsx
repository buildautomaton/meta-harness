import { PanelSlot } from './panel-slot.js';

export function DashboardShell() {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <PanelSlot panel="nav" className="w-14 shrink-0 border-r border-border bg-card" />
      <div className="min-w-0 flex-1 overflow-hidden bg-muted/30">
        <div className="mx-auto flex h-full max-w-2xl flex-col border-x border-border bg-background">
          <PanelSlot panel="main" className="min-h-0 min-w-0 flex-1" />
        </div>
      </div>
    </div>
  );
}
