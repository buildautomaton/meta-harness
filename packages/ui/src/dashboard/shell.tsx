import { useUiHost } from './host.js';
import { ColumnsShell } from './layouts/columns.js';
import { MasterDetailShell } from './layouts/master-detail.js';
import { SidebarShell } from './layouts/sidebar.js';

export function DashboardShell() {
  const { slots } = useUiHost();
  if (slots.layout === 'columns') return <ColumnsShell />;
  if (slots.layout === 'master-detail') return <MasterDetailShell />;
  return <SidebarShell />;
}
