import { artifactTabLabel } from './preview-files.js';
import { WorkCardThumbPreview } from './work-card-thumb-preview.js';
import { cn } from '../../design/cn.js';
import type { ArtifactFile } from './types.js';

export function WorkCardPreviewStrip(props: {
  files: ArtifactFile[];
  path: string;
  onOpen: (path: string) => void;
}) {
  if (props.files.length < 2) return null;
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3">
      {props.files.map((file) => {
        const active = file.path === props.path;
        return (
          <button
            key={file.path}
            type="button"
            onClick={() => props.onOpen(file.path)}
            aria-current={active ? 'true' : undefined}
            className={cn('w-28 shrink-0 rounded-xl text-left', active && 'ring-2 ring-foreground/50')}
          >
            <WorkCardThumbPreview
              html={file.content}
              label={artifactTabLabel(file.path)}
              className="h-16 rounded-xl"
            />
          </button>
        );
      })}
    </div>
  );
}
