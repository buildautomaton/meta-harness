import { useState } from 'react';
import { WorkCardHeader } from './work-card-header.js';
import { WorkCardSummary } from './work-card-summary.js';
import { WorkCardThumbs } from './work-card-thumbs.js';
import { WorkCardPreview } from './work-card-preview.js';
import { QuestionList } from './questions.js';
import { useWork } from './context.js';
import type { WorkArtifact } from './types.js';

export function WorkCard({ artifact }: { artifact: WorkArtifact }) {
  const { client, reload } = useWork();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const subjects = Object.entries(artifact.questions);
  return (
    <article className="bg-background">
      <WorkCardHeader artifact={artifact} />
      <WorkCardSummary content={artifact.description} />
      <WorkCardThumbs files={artifact.files} onOpen={setOpenPath} />
      <WorkCardPreview
        files={artifact.files}
        path={openPath}
        onOpen={setOpenPath}
        onClose={() => setOpenPath(null)}
      />
      {subjects.length > 0 ? (
        <div className="space-y-4 border-t border-border px-4 py-4">
          {subjects.map(([subject, questions]) => (
            <QuestionList
              key={subject}
              subject={subject}
              questions={questions}
              onAnswer={(subj, questionId, choiceId) => {
                void client.answerQuestions(artifact.id, [{ subject: subj, questionId, choiceId }]).then(reload);
              }}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
