import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { writeJson, readJson } from './io.js';
import type { AddWorkInput } from '@/types/work/records.js';

export async function handleWorkCollection(
  req: IncomingMessage,
  res: ServerResponse,
  work: WorkImplementation,
  method: string,
): Promise<void> {
  if (method === 'GET') {
    writeJson(res, 200, await work.listWork());
    return;
  }
  if (method === 'POST') {
    const body = (await readJson(req)) as AddWorkInput;
    if (!body?.title) {
      writeJson(res, 400, { error: 'title is required' });
      return;
    }
    writeJson(res, 201, await work.addWork(body));
    return;
  }
  writeJson(res, 405, { error: 'Method not allowed' });
}
