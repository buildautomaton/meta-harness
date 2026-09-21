import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWork } from './context.js';
import { ProjectChip } from './project-chip.js';
import { ProjectEditor } from './project-editor.js';

export function ProjectTabs() {
  const { projects, project, setProject, addProject, renameProject } = useWork();
  const [adding, setAdding] = useState(false);
  return (
    <div className="flex h-12 items-center gap-1 overflow-x-auto">
      {projects.map((name) => (
        <ProjectChip
          key={name || 'inbox'}
          name={name}
          active={name === project}
          onSelect={() => setProject(name)}
          onRename={(next) => void renameProject(name, next)}
        />
      ))}
      {adding ? (
        <ProjectEditor
          initial=""
          wide
          onCommit={(value) => {
            setAdding(false);
            addProject(value);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          type="button"
          aria-label="Add project"
          onClick={() => setAdding(true)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

export function ProjectHeader() {
  return <ProjectTabs />;
}
