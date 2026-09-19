import { NumberedQuestion } from '@buildautomaton/ui-runtime';
import { QuestionSet } from './question-set.js';
import { useWork } from './context.js';
import type { WorkItem } from './types.js';

export function DraftQuestions({ item }: { item: WorkItem }) {
  const { client, reload } = useWork();
  if (item.questions.length === 0) return null;
  return (
    <QuestionSet>
      {item.questions.map((question, index) => (
        <NumberedQuestion
          key={question.id}
          index={index + 1}
          prompt={question.prompt}
          choices={question.choices}
          selectedId={question.answerId}
          onSelect={(choiceId) => {
            void client
              .answerWorkQuestions(item.id, [{ subject: '__draft__', questionId: question.id, choiceId }])
              .then(reload);
          }}
        />
      ))}
    </QuestionSet>
  );
}
