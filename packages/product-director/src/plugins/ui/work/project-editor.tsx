import { useEffect, useRef } from 'react';
import { cn } from '@buildautomaton/ui-runtime';

export function ProjectEditor(props: {
  initial: string;
  wide?: boolean;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  useEffect(() => {
    input.current?.focus();
    input.current?.select();
  }, []);
  const finish = (fn: () => void) => {
    if (done.current) return;
    done.current = true;
    fn();
  };
  const commit = () => finish(() => props.onCommit(input.current?.value ?? ''));
  return (
    <form
      className="flex h-7 shrink-0 items-center rounded-full bg-muted px-3"
      onSubmit={(event) => {
        event.preventDefault();
        commit();
      }}
    >
      <input
        ref={input}
        defaultValue={props.initial}
        aria-label="Project name"
        placeholder="Project name"
        size={props.wide ? 14 : Math.max(8, props.initial.length + 2)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            finish(props.onCancel);
          }
        }}
        className={cn(
          'bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground',
          props.wide ? 'w-[11rem]' : 'min-w-[8ch]',
        )}
      />
    </form>
  );
}
