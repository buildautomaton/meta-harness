import { artifactTabLabel } from './preview-files.js';
import { WorkCardThumbPreview } from './work-card-thumb-preview.js';
import type { ArtifactFile } from './types.js';

export function WorkCardThumb({ file, onOpen }: { file: ArtifactFile; onOpen: (path: string) => void }) {
  const label = artifactTabLabel(file.path);
  return (
    <button type="button" onClick={() => onOpen(file.path)} className="flex w-full flex-col gap-2 text-left">
      <WorkCardThumbPreview path={file.path} content={file.content} label={label} />
      <span className="truncate text-xs font-medium capitalize text-muted-foreground">{label}</span>
    </button>
  );
}
