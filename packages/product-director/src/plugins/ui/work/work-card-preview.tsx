import { X } from 'lucide-react';
import { previewArtifactFiles } from './preview-files.js';
import { WorkCardPreviewStrip } from './work-card-preview-strip.js';
import { withMermaidStyle } from './with-mermaid-style.js';
import { previewSrcDoc } from '../../runtime/work/artifacts/render/preview-src.js';
import type { ArtifactFile } from './types.js';

export function WorkCardPreview(props: {
  files: ArtifactFile[];
  path: string | null;
  onOpen: (path: string) => void;
  onClose: () => void;
}) {
  const previews = previewArtifactFiles(props.files);
  const file = previews.find((row) => row.path === props.path);
  if (!props.path || !file) return null;
  const srcDoc = withMermaidStyle(previewSrcDoc(file.path, file.content));
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
      onClick={props.onClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border bg-card shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start border-b border-border">
          <WorkCardPreviewStrip files={previews} path={props.path} onOpen={props.onOpen} />
          <button
            type="button"
            aria-label="Close"
            onClick={props.onClose}
            className="m-2 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <iframe title={file.path} srcDoc={srcDoc} className="min-h-0 flex-1 bg-[#101218]" />
      </div>
    </div>
  );
}
