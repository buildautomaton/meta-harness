import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from './cn.js';

export function EmptyState(props: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const Icon = props.icon;
  return (
    <div className={cn('flex h-full flex-col items-center justify-center gap-2 p-8 text-center', props.className)}>
      <Icon className="h-8 w-8 text-muted-foreground" />
      <h2 className="text-sm font-medium">{props.title}</h2>
      {props.description ? <p className="max-w-sm text-sm text-muted-foreground">{props.description}</p> : null}
      {props.action}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
        checked ? 'border-foreground' : 'border-muted-foreground/40',
      )}
    >
      {checked ? <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> : null}
    </span>
  );
}
