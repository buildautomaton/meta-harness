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
    <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto px-4 py-3">
      {props.files.map((file) => {
        const active = file.path === props.path;
        const label = artifactTabLabel(file.path);
        return (
          <button
            key={file.path}
            type="button"
            onClick={() => props.onOpen(file.path)}
            aria-current={active ? 'true' : undefined}
            className={cn('flex w-28 shrink-0 flex-col gap-1.5 text-left', active && 'opacity-100')}
          >
            <WorkCardThumbPreview
              html={file.content}
              label={label}
              className={cn('h-16 rounded-xl', active && 'ring-2 ring-foreground/50')}
            />
            <span className="truncate text-[11px] font-medium capitalize text-muted-foreground">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
