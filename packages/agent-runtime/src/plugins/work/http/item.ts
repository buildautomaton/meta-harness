import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
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
  if (method === 'GET' && !rest) {
    const item = await work.getWork(id);
    writeJson(res, item ? 200 : 404, item ?? { error: 'Not found' });
    return;
  }
  if (method === 'PATCH' && !rest) {
    const item = await work.updateWork(id, (await readJson(req)) as WorkPatch);
    writeJson(res, item ? 200 : 404, item ?? { error: 'Not found' });
    return;
  }
  writeJson(res, 404, { error: 'Not found' });
}
