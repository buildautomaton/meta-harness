import type { UiSurface } from '../../core/plugin.js';
import { SplitPanel } from '../../design/split-panel.js';
import { columnPaneClass } from '../chrome.js';

const MIN = 240;

function Pane({ surface }: { surface: UiSurface }) {
  const View = surface.component;
  return (
    <div className={columnPaneClass}>
      <View panel="column" />
    </div>
  );
}

export function SplitColumns(props: { panes: UiSurface[]; defaultWidth: number }) {
  const { panes, defaultWidth } = props;
  if (panes.length === 0) return null;
  if (panes.length === 1) return <Pane surface={panes[0]!} />;
  const [first, ...rest] = panes;
  return (
    <SplitPanel
      preferenceKey={`dashboard.column.${first!.id}`}
      defaultLeftWidth={defaultWidth}
      minLeftWidth={MIN}
      maxLeftWidth={2400}
      minRightWidth={MIN * Math.max(1, rest.length)}
      left={<Pane surface={first!} />}
      right={<SplitColumns panes={rest} defaultWidth={defaultWidth} />}
    />
  );
}
