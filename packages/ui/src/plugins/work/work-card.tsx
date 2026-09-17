import { useState } from 'react';
import { WorkCardHeader } from './work-card-header.js';
import { WorkCardSummary } from './work-card-summary.js';
import { WorkCardThumbs } from './work-card-thumbs.js';
import { WorkCardPreview } from './work-card-preview.js';
import { WorkCardQuestions } from './work-card-questions.js';
import type { WorkArtifact } from './types.js';

export function WorkCard({ artifact }: { artifact: WorkArtifact }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
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
      <WorkCardQuestions artifact={artifact} />
    </article>
  );
}
