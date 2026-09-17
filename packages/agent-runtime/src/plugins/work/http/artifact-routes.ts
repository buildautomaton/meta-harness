import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import type { QuestionAnswer } from '@/types/work/questions.js';
import { writeJson, readJson } from './io.js';

export async function handleArtifactRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  work: WorkImplementation,
  rest: string,
  method: string,
): Promise<void> {
  if (!rest && method === 'GET') {
    writeJson(res, 200, await work.listArtifacts());
    return;
  }
  const [artifactId, action] = rest.split('/');
  if (!artifactId) {
    writeJson(res, 404, { error: 'Not found' });
    return;
  }
  if (method === 'GET' && !action) {
    const artifact = await work.getArtifact(artifactId);
    writeJson(res, artifact ? 200 : 404, artifact ?? { error: 'Not found' });
    return;
  }
  if (method === 'POST' && action === 'answers') {
    await work.answerQuestions(artifactId, (await readJson(req)) as QuestionAnswer[]);
    writeJson(res, 204, null);
    return;
  }
  writeJson(res, 404, { error: 'Not found' });
}
