import { useEffect, useState } from 'react';
import { Inbox } from 'lucide-react';
import { EmptyState } from '../../design/status.js';
import { useWork } from './context.js';
import { ArtifactPreview } from './artifact-preview.js';
import { QuestionList } from './questions.js';
import type { WorkArtifact } from './types.js';

export function WorkDetailView() {
  const { client, items, selectedId } = useWork();
  const item = items.find((row) => row.id === selectedId) ?? items[0];
  const [artifacts, setArtifacts] = useState<WorkArtifact[]>([]);
  useEffect(() => {
    if (!item) return;
    void client.listArtifacts(item.id).then(async (summaries) => {
      const full = await Promise.all(summaries.map((row) => client.getArtifact(row.id)));
      setArtifacts(full.filter((row): row is WorkArtifact => row !== null));
    });
  }, [client, item?.id]);
  if (!item) {
    return <EmptyState icon={Inbox} title="Select work" description="Pick a draft or completed item." />;
  }
  const artifact = artifacts[0];
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">{item.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{item.content || artifact?.description}</p>
      </header>
      {artifact ? (
        <>
          <ArtifactPreview files={artifact.files} />
          <div className="border-t border-border p-6">
            {Object.entries(artifact.questions).map(([subject, questions]) => (
              <QuestionList
                key={subject}
                subject={subject}
                questions={questions}
                onAnswer={(subj, questionId, choiceId) => {
                  void client.answerQuestions(artifact.id, [{ subject: subj, questionId, choiceId }]);
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="p-6 text-sm text-muted-foreground">No artifacts yet. They appear after tell_what_was_built.</p>
      )}
    </div>
  );
}
