import { Trash2 } from 'lucide-react';
import { Button } from '@buildautomaton/ui-runtime';
import { useWork } from './context.js';

export function DraftDelete({ id }: { id: string }) {
  const { client, reload } = useWork();
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      title="Delete draft"
      aria-label="Delete draft"
      className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      onClick={() => {
        void client.deleteWork(id).then(reload);
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
