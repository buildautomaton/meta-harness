import type { DesignQuestion, WorkArtifact, WorkItem, WorkOrigin } from './types.js';

type ItemSlice = Pick<WorkItem, 'id' | 'prompt' | 'title' | 'decisions'> & {
  origin?: WorkOrigin;
};
type ArtifactSlice = Pick<WorkArtifact, 'id' | 'questions'>;

function promptOf(item: ItemSlice): string {
  return item.prompt.trim() || item.title.trim();
}

function matchesQuestion(item: ItemSlice, question: DesignQuestion): boolean {
  const text = promptOf(item);
  if (!text) return false;
  if (question.prompt.trim() === text) return true;
  return question.choices.some((choice) => (choice.prompt ?? '').trim() === text);
}

export function resolveWorkOrigin(item: ItemSlice, artifacts: ArtifactSlice[]): WorkOrigin {
  if (item.origin?.kind === 'question' || item.origin?.kind === 'draft') return item.origin;
  for (const artifact of artifacts) {
    for (const [subject, questions] of Object.entries(artifact.questions ?? {})) {
      for (const question of questions) {
        if (!question.answerId || !matchesQuestion(item, question)) continue;
        return { kind: 'question', artifactId: artifact.id, subject, questionId: question.id };
      }
    }
  }
  return { kind: 'draft', workId: item.id };
}
