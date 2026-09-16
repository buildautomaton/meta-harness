import { Inbox } from 'lucide-react';
import { useWork } from './context.js';
import { cn } from '../../design/cn.js';
import { Badge } from '../../design/status.js';

export function WorkQueueView() {
  const { items, selectedId, setSelectedId } = useWork();
  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <Inbox className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No work yet. Add a draft, or wait for a submission.</p>
      </div>
    );
  }
  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto p-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setSelectedId(item.id)}
          className={cn(
            'mb-1 rounded-md px-3 py-2 text-left hover:bg-accent',
            selectedId === item.id && 'bg-accent',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{item.title}</span>
            <Badge>{item.status}</Badge>
          </div>
          {item.content ? (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.content}</p>
          ) : null}
        </button>
      ))}
    </div>
  );
}
