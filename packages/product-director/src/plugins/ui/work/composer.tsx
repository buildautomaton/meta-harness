import { PromptComposer } from '@buildautomaton/ui-runtime';
import { useWork } from './context.js';
import { titleFromPrompt } from './draft-title.js';

export function WorkComposer() {
  const { client, reload } = useWork();
  return (
    <PromptComposer
      placeholder="Add a draft…"
      onSubmit={async (content) => {
        await client.addWork({ title: titleFromPrompt(content), content });
        await reload();
      }}
    />
  );
}
