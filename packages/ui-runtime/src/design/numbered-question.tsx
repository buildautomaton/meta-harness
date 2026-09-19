import { NumberedBlock } from './numbered-block.js';
import { ChoiceList, type ChoiceOption } from './choice-list.js';

export function NumberedQuestion(props: {
  index: number;
  label?: string;
  id?: string;
  prompt: string;
  choices: ChoiceOption[];
  selectedId?: string | null;
  disabled?: boolean;
  clearable?: boolean;
  onSelect: (choiceId: string) => void;
}) {
  return (
    <NumberedBlock index={props.index} label={props.label} id={props.id}>
      <fieldset className="space-y-2 bg-transparent">
        <legend className="text-sm font-medium leading-snug">{props.prompt}</legend>
        <ChoiceList
          name={props.prompt}
          choices={props.choices}
          selectedId={props.selectedId}
          disabled={props.disabled}
          clearable={props.clearable}
          onSelect={props.onSelect}
        />
      </fieldset>
    </NumberedBlock>
  );
}
