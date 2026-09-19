import { NumberedQuestion } from '@buildautomaton/ui-runtime';
import { flattenQuestions } from './flatten-questions.js';
import { QuestionSet } from './question-set.js';
import { useWork } from './context.js';
import { questionOriginId } from './work-origin.js';
import type { WorkArtifact } from './types.js';

export function WorkCardQuestions({ artifact }: { artifact: WorkArtifact }) {
  const { client, reload, ingestItems, dropItems } = useWork();
  const items = flattenQuestions(artifact.questions);
  if (items.length === 0) return null;
  return (
    <QuestionSet>
      {items.map((item, index) => (
        <NumberedQuestion
          key={item.key}
          id={questionOriginId({
            kind: 'question',
            artifactId: artifact.id,
            subject: item.subject,
            questionId: item.question.id,
          })}
          index={index + 1}
          label={item.subjectLabel}
          prompt={item.question.prompt}
          choices={item.question.choices}
          selectedId={item.question.answerId}
          disabled={item.question.locked}
          clearable={!item.question.locked}
          onSelect={(choiceId) => {
            void client
              .answerQuestions(artifact.id, [
                { subject: item.subject, questionId: item.question.id, choiceId },
              ])
              .then((result) => {
                ingestItems(result.queued);
                dropItems(result.removed);
              })
              .finally(() => reload());
          }}
        />
      ))}
    </QuestionSet>
  );
}
