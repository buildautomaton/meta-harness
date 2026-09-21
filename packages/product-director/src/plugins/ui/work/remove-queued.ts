import type { WorkClient, WorkItem, WorkOrigin } from './types.js';

export async function removeQueued(
  client: WorkClient,
  item: WorkItem,
  origin: WorkOrigin,
): Promise<{ queued: WorkItem[]; removed: string[] }> {
  if (origin.kind === 'question') {
    const result = await client.answerQuestions(origin.artifactId, [
      { subject: origin.subject, questionId: origin.questionId, choiceId: '' },
    ]);
    return { queued: result.queued, removed: [...result.removed, item.id] };
  }
  await client.updateWork(item.id, { unqueue: true });
  return { queued: [], removed: [item.id] };
}
