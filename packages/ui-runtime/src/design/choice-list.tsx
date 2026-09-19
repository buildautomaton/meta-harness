import { ChevronDown } from 'lucide-react';
import { cn } from './cn.js';
import { visibleChoices } from './choice-collapse.js';
import { ChoiceRow } from './choice-row.js';
import { useChoiceCollapse } from './use-choice-collapse.js';
import type { ChoiceOption } from './choice-option.js';

export type { ChoiceOption };

export function ChoiceList(props: {
  name: string;
  choices: ChoiceOption[];
  selectedId?: string | null;
  disabled?: boolean;
  clearable?: boolean;
  onSelect: (choiceId: string) => void;
}) {
  const selectedId = props.selectedId ?? '';
  const collapse = useChoiceCollapse(selectedId);
  const choices = visibleChoices(props.choices, selectedId, collapse.open);
  return (
    <div className="space-y-2 bg-transparent">
      <div className="space-y-1 bg-transparent" role="radiogroup" aria-label={props.name}>
        {choices.map((choice) => (
          <ChoiceRow
            key={choice.id}
            choice={choice}
            checked={selectedId === choice.id}
            disabled={props.disabled}
            clearable={props.clearable}
            onSelect={(choiceId) => {
              if (choiceId) collapse.collapseNow();
              props.onSelect(choiceId);
            }}
          />
        ))}
      </div>
      {selectedId ? (
        <button
          type="button"
          onClick={collapse.toggle}
          aria-expanded={collapse.open}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {collapse.open ? 'Show less' : 'Show all answers'}
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', collapse.open && 'rotate-180')}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
