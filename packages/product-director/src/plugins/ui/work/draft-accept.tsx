import { ListTodo } from 'lucide-react';
import { Button } from '@buildautomaton/ui-runtime';
import { useWork } from './context.js';

export function DraftAccept({ id }: { id: string }) {
  const { client, reload } = useWork();
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      title="Accept and queue"
      aria-label="Accept and queue"
      className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600"
      onClick={() => {
        void client.updateWork(id, { queued: true }).then(reload);
      }}
    >
      <ListTodo className="h-4 w-4" />
    </Button>
  );
}
