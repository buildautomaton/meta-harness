import { artifactTabLabel, previewHtmlFiles } from './preview-files.js';
import { WorkCardPreviewStrip } from './work-card-preview-strip.js';
import type { ArtifactFile } from './types.js';

export function WorkCardPreview(props: {
  files: ArtifactFile[];
  path: string | null;
  onOpen: (path: string) => void;
  onClose: () => void;
}) {
  const html = previewHtmlFiles(props.files);
  const file = html.find((row) => row.path === props.path);
  if (!props.path || !file) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
      onClick={props.onClose}
    >
      <div
        className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border bg-card shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <WorkCardPreviewStrip files={html} path={props.path} onOpen={props.onOpen} />
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold capitalize">{artifactTabLabel(file.path)}</h3>
          <button type="button" className="text-sm" onClick={props.onClose}>
            Close
          </button>
        </div>
        <iframe title={file.path} srcDoc={file.content} className="min-h-0 flex-1 bg-white" />
      </div>
    </div>
  );
}
