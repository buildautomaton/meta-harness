import { useUiHost } from './host.js';
import { cn } from '../design/cn.js';

export function PanelSlot({ panel, className }: { panel: string; className?: string }) {
  const { surfacesIn } = useUiHost();
  const surfaces = surfacesIn(panel);
  if (surfaces.length === 0) return <div className={className} />;
  return (
    <div className={cn('flex min-h-0 min-w-0 flex-col', className)}>
      {surfaces.map((surface) => {
        const View = surface.component;
        return <View key={surface.id} panel={panel} />;
      })}
    </div>
  );
}
