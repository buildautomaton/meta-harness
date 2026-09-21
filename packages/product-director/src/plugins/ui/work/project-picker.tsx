import { Folder } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@buildautomaton/ui-runtime';
import { matchProjects, resolveProjectPick } from './match-projects.js';

export function ProjectPicker(props: {
  projects: string[];
  anchor: DOMRect;
  ignoreRef: RefObject<HTMLElement | null>;
  onPick: (name: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const options = useMemo(() => matchProjects(props.projects, query), [props.projects, query]);
  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panel.current?.contains(target) || props.ignoreRef.current?.contains(target)) return;
      props.onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') props.onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [props]);
  return createPortal(
    <div
      ref={panel}
      className="fixed z-[80] w-56 rounded-md border border-foreground/20 bg-popover p-1 shadow-lg"
      style={{ top: props.anchor.bottom + 4, right: window.innerWidth - props.anchor.right }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const name = resolveProjectPick(props.projects, query);
          if (name) props.onPick(name);
        }}
      >
        <Input
          ref={input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find or create project"
          aria-label="Find or create project"
          className="h-8 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </form>
      {options.length === 0 ? (
        <p className="px-2 py-1.5 text-xs text-muted-foreground">Type a name to create</p>
      ) : (
        <ul className="mt-1 max-h-48 overflow-y-auto" role="listbox">
          {options.map((option) => (
            <li key={option.create ? `create:${option.name}` : option.name}>
              <button
                type="button"
                role="option"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                onClick={() => props.onPick(option.name)}
              >
                <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                {option.create ? `Create “${option.name}”` : option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body,
  );
}
