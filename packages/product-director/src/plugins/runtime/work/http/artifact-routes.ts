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
  if (method === 'PATCH' && !action) {
    const body = (await readJson(req)) as { project?: string };
    if (typeof body?.project !== 'string') {
      writeJson(res, 400, { error: 'project is required' });
      return;
    }
    const artifact = await work.updateArtifact(artifactId, { project: body.project });
    writeJson(res, artifact ? 200 : 404, artifact ?? { error: 'Not found' });
    return;
  }
  if (method === 'POST' && action === 'answers') {
    const raw = await readJson(req);
    const queued = await work.answerQuestions(artifactId, coerceAnswers(raw));
    writeJson(res, 200, queued);
    return;
  }
  writeJson(res, 404, { error: 'Not found' });
}

function coerceAnswers(raw: unknown): QuestionAnswer[] {
  if (Array.isArray(raw)) return raw as QuestionAnswer[];
  if (raw && typeof raw === 'object' && Array.isArray((raw as { answers?: unknown }).answers)) {
    return (raw as { answers: QuestionAnswer[] }).answers;
  }
  return [];
}
