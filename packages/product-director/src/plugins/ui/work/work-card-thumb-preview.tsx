import { cn } from '@buildautomaton/ui-runtime';
import { withMermaidStyle } from './with-mermaid-style.js';
import { previewSrcDoc } from '../../runtime/work/artifacts/render/preview-src.js';

export function WorkCardThumbPreview(props: {
  path: string;
  content: string;
  label: string;
  className?: string;
}) {
  const html = withMermaidStyle(previewSrcDoc(props.path, props.content));
  return (
    <div
      className={cn(
        'relative h-44 overflow-hidden rounded-2xl bg-background/40 ring-1 ring-border/60',
        props.className,
      )}
    >
      <iframe
        title={props.label}
        srcDoc={html}
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-[300%] w-[300%] origin-top-left scale-[0.333] border-0 bg-[#101218]"
      />
    </div>
  );
}
