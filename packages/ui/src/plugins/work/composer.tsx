import { useState } from 'react';
import { Button } from '../../design/button.js';
import { Input, Textarea } from '../../design/fields.js';
import { useWork } from './context.js';

export function WorkComposer() {
  const { client, reload } = useWork();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="flex flex-col gap-2 border-t border-border p-3"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!title.trim()) return;
        setBusy(true);
        await client.addWork({ title: title.trim(), content });
        setTitle('');
        setContent('');
        await reload();
        setBusy(false);
      }}
    >
      <Input placeholder="Draft title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="What should be built?" value={content} onChange={(e) => setContent(e.target.value)} />
      <Button type="submit" size="sm" disabled={busy || !title.trim()}>
        Add draft
      </Button>
    </form>
  );
}
