import { Folder } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@buildautomaton/ui-runtime';
import { useWork } from './context.js';
import { assignToProject } from './assign-to-project.js';
import { ProjectPicker } from './project-picker.js';

export function AssignProjectButton(props: { project?: string; workId?: string; artifactId?: string }) {
  const { client, projects, reload } = useWork();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const assign = async (name: string) => {
    try {
      const next = await assignToProject(client, props, name);
      if (!next) return;
      setOpen(false);
      await reload();
    } catch {
      return;
    }
  };
  return (
    <div className="relative shrink-0">
      <Button
        ref={button}
        type="button"
        size="icon"
        variant="ghost"
        title="Assign project"
        aria-label="Assign project"
        aria-expanded={open}
        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          setAnchor(button.current?.getBoundingClientRect() ?? null);
          setOpen(true);
        }}
      >
        <Folder className="h-4 w-4" />
      </Button>
      {open && anchor ? (
        <ProjectPicker
          projects={projects}
          anchor={anchor}
          ignoreRef={button}
          onPick={(name) => void assign(name)}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
