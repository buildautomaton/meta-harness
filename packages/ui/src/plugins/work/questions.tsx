import { cn } from '../../design/cn.js';
import { RadioDot } from '../../design/status.js';
import type { DesignQuestion } from './types.js';

export function QuestionList(props: {
  subject: string;
  questions: DesignQuestion[];
  disabled?: boolean;
  onAnswer: (subject: string, questionId: string, choiceId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {props.questions.map((question) => (
        <fieldset key={question.id} className="space-y-2">
          <legend className="text-sm font-medium">{question.prompt}</legend>
          {question.choices.map((choice) => {
            const checked = question.answerId === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                role="radio"
                aria-checked={checked}
                disabled={props.disabled}
                onClick={() => props.onAnswer(props.subject, question.id, choice.id)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-md px-1 py-1 text-left text-sm',
                  checked ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <RadioDot checked={checked} />
                <span>{choice.label}</span>
              </button>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}
