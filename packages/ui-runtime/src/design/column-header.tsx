import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function ColumnHeader({
  title,
  icon: Icon,
  trailing,
}: {
  title: string;
  icon?: LucideIcon;
  trailing?: ReactNode;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      {Icon ? <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> : null}
      <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight">{title}</h1>
      {trailing}
    </header>
  );
}
