import { previewHtmlFiles, visibleThumbs } from './preview-files.js';
import { WorkCardThumb } from './work-card-thumb.js';
import type { ArtifactFile } from './types.js';

export function WorkCardThumbs({
  files,
  onOpen,
}: {
  files: ArtifactFile[];
  onOpen: (path: string) => void;
}) {
  const html = previewHtmlFiles(files);
  if (html.length === 0) return null;
  const { shown, more } = visibleThumbs(html);
  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-4 sm:grid-cols-3">
      {shown.map((file) => (
        <WorkCardThumb key={file.path} file={file} onOpen={onOpen} />
      ))}
      {more > 0 ? (
        <button
          type="button"
          onClick={() => onOpen(html[shown.length]!.path)}
          className="flex h-44 w-full flex-col items-center justify-center gap-1 rounded-2xl bg-muted/60 ring-1 ring-border/60"
        >
          <span className="text-2xl font-semibold tabular-nums">{more}+</span>
          <span className="text-xs text-muted-foreground">more</span>
        </button>
      ) : null}
    </div>
  );
}
