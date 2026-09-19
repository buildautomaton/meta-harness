import { useState } from 'react';
import { WorkCardHeader } from './work-card-header.js';
import { WorkCardSummary } from './work-card-summary.js';
import { WorkCardThumbs } from './work-card-thumbs.js';
import { WorkCardPreview } from './work-card-preview.js';
import { WorkCardQuestions } from './work-card-questions.js';
import { artifactOriginId } from './work-origin.js';
import type { WorkArtifact } from './types.js';

export function WorkCard({ artifact }: { artifact: WorkArtifact }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  return (
    <article id={artifactOriginId(artifact.id)} className="bg-background scroll-mt-3 transition-colors data-[origin-flash]:bg-muted">
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
