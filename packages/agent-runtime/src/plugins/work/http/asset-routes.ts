import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import type { WorkAssetInput } from '@/types/work/events.js';
import { writeJson, readJson } from './io.js';

export async function handleAssetRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  work: WorkImplementation,
  rest: string,
  method: string,
): Promise<void> {
  if (method === 'POST' && !rest) {
    const body = (await readJson(req)) as WorkAssetInput;
    if (!body?.filename || !body.mimeType || !body.base64) {
      writeJson(res, 400, { error: 'filename, mimeType, and base64 are required' });
      return;
    }
    writeJson(res, 201, await work.saveAsset(body));
    return;
  }
  if (method === 'GET' && !rest) {
    const sessionId = new URL(req.url ?? '/', 'http://127.0.0.1').searchParams.get('sessionId');
    if (!sessionId) {
      writeJson(res, 400, { error: 'sessionId is required' });
      return;
    }
    writeJson(res, 200, await work.listAssets(sessionId));
    return;
  }
  writeJson(res, 404, { error: 'Not found' });
}
