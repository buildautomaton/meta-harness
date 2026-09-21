import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import type { QuestionAnswer } from '@/types/work/questions.js';
import type { WorkPatch } from '@/types/work/records.js';
import { writeJson, readJson } from './io.js';

export async function handleWorkItem(
  req: IncomingMessage,
  res: ServerResponse,
  work: WorkImplementation,
  id: string,
  rest: string | undefined,
  method: string,
): Promise<void> {
  if (rest === 'artifacts' && method === 'GET') {
    writeJson(res, 200, await work.listArtifacts(id));
    return;
  }
  if (rest === 'answers' && method === 'POST') {
    const item = await work.answerWorkQuestions(id, (await readJson(req)) as QuestionAnswer[]);
    writeJson(res, item ? 200 : 404, item ?? { error: 'Not found' });
    return;
  }
  if (method === 'GET' && !rest) {
    const item = await work.getWork(id);
    writeJson(res, item ? 200 : 404, item ?? { error: 'Not found' });
    return;
  }
  if (method === 'PATCH' && !rest) {
    const patch = (await readJson(req)) as WorkPatch;
    const item = await work.updateWork(id, patch);
    if (item) {
      writeJson(res, 200, item);
      return;
    }
    writeJson(res, patch.unqueue ? 204 : 404, patch.unqueue ? null : { error: 'Not found' });
    return;
  }
  if (method === 'DELETE' && !rest) {
    const deleted = await work.deleteWork(id);
    writeJson(res, deleted ? 204 : 404, deleted ? null : { error: 'Not found' });
    return;
  }
  writeJson(res, 404, { error: 'Not found' });
}
