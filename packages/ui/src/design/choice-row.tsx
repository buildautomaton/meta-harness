import { cn } from './cn.js';
import { RadioDot } from './status.js';
import type { ChoiceOption } from './choice-option.js';

export function ChoiceRow(props: {
  choice: ChoiceOption;
  checked: boolean;
  disabled?: boolean;
  clearable?: boolean;
  onSelect: (choiceId: string) => void;
}) {
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
        <span className="leading-snug">{props.choice.label}</span>
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
