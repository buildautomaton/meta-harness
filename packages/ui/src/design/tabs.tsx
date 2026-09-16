import { createContext, useContext, type ReactNode } from 'react';
import { cn } from './cn.js';

const TabsContext = createContext<{ value: string; onValueChange: (value: string) => void } | null>(null);

export function Tabs(props: {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <TabsContext.Provider value={{ value: props.value, onValueChange: props.onValueChange }}>
      <div className={cn('flex h-full flex-col', props.className)}>{props.children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex border-b border-border', className)}>{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs');
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'border-b-[3px] border-transparent px-4 py-2 text-sm font-medium text-muted-foreground',
        active && 'border-primary text-foreground',
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be used within Tabs');
  if (ctx.value !== value) return null;
  return <div className={cn('min-h-0 flex-1 overflow-auto', className)}>{children}</div>;
}
