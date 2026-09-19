import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ColumnHeader } from './column-header.js';

export function Column({
  title,
  icon,
  toolbar,
  trailing,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  toolbar?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
      <ColumnHeader title={title} icon={icon} trailing={trailing} />
      {toolbar}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </section>
  );
}
