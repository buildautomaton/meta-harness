import { NumberedQuestion } from '../../design/numbered-question.js';
import { flattenQuestions } from './flatten-questions.js';
import { useWork } from './context.js';
import type { WorkArtifact } from './types.js';

export function WorkCardQuestions({ artifact }: { artifact: WorkArtifact }) {
  const { client, reload, ingestItems, dropItems } = useWork();
  const items = flattenQuestions(artifact.questions);
  if (items.length === 0) return null;
  return (
    <div className="divide-y divide-border/60 border-t border-border/60">
      {items.map((item, index) => (
        <NumberedQuestion
          key={item.key}
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
    </div>
  );
}
