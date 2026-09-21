import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@buildautomaton/ui-runtime';
import { projectLabel } from './project-name.js';
import { ProjectEditor } from './project-editor.js';

export function ProjectChip(props: {
  name: string;
  active: boolean;
  onSelect: () => void;
  onRename: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  if (editing && props.name) {
    return (
      <ProjectEditor
        initial={props.name}
        onCommit={(value) => {
          setEditing(false);
          if (value.trim()) props.onRename(value);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }
  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        onClick={props.onSelect}
        className={cn(
          'rounded-full py-1 pl-3 text-sm font-medium text-muted-foreground hover:text-foreground',
          props.name ? 'pr-7' : 'pr-3',
          props.active && 'bg-muted text-foreground',
        )}
      >
        {projectLabel(props.name)}
      </button>
      {props.name ? (
        <button
          type="button"
          aria-label="Rename project"
          onClick={() => setEditing(true)}
          className="absolute right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
        >
          <Pencil className="h-3 w-3" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
