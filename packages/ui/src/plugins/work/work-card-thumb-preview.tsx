import { cn } from '../../design/cn.js';
import { withMermaidStyle } from './with-mermaid-style.js';

export function WorkCardThumbPreview(props: { html: string; label: string; className?: string }) {
  return (
    <div
      className={cn(
        'relative h-44 overflow-hidden rounded-2xl bg-background/40 ring-1 ring-border/60',
        props.className,
      )}
    >
      <iframe
        title={props.label}
        srcDoc={withMermaidStyle(props.html)}
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-[300%] w-[300%] origin-top-left scale-[0.333] border-0 bg-[#101218]"
      />
    </div>
  );
}
