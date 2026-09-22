import { cn } from './cn.js';
import { Badge, RadioDot } from './status.js';
import { choiceHints, type ChoiceOption } from './choice-option.js';

export function ChoiceRow(props: {
  choice: ChoiceOption;
  checked: boolean;
  disabled?: boolean;
  clearable?: boolean;
  onSelect: (choiceId: string) => void;
}) {
  const hints = choiceHints(props.choice);
  return (
    <div className="flex items-start gap-2">
      <button
        type="button"
        role="radio"
        aria-checked={props.checked}
        disabled={props.disabled}
        onClick={() => {
          if (!props.checked) props.onSelect(props.choice.id);
        }}
        className={cn(
          'flex min-w-0 flex-1 items-start gap-2.5 rounded-lg px-0.5 py-1 text-left text-sm',
          props.checked ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
          props.disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <RadioDot checked={props.checked} />
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-snug">
          {props.choice.label}
          {hints.map((hint) => (
            <Badge
              key={hint}
              className="whitespace-nowrap bg-muted px-1.5 py-0 text-[10px] font-medium leading-4"
            >
              {hint}
            </Badge>
          ))}
        </span>
      </button>
      {props.checked && props.clearable !== false ? (
        <button
          type="button"
          disabled={props.disabled}
          onClick={() => props.onSelect('')}
          className="shrink-0 px-0.5 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
