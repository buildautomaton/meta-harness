import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { writeJson } from './io.js';
import { handleWorkCollection } from './collection.js';
import { handleWorkItem } from './item.js';
import { handleArtifactRoutes } from './artifact-routes.js';
import { restAfterPrefix } from './prefix.js';

export async function dispatchWorkHttp(
  req: IncomingMessage,
  res: ServerResponse,
  work: WorkImplementation,
  pathname: string,
  prefix: string,
  surface?: string,
): Promise<void> {
  try {
    const rest = restAfterPrefix(pathname, prefix);
    if (rest === null) {
      writeJson(res, 404, { error: 'Not found' });
      return;
    }
    const method = req.method ?? 'GET';
    if (surface === 'artifacts') {
      await handleArtifactRoutes(req, res, work, rest, method);
      return;
    }
    if (!rest) {
      await handleWorkCollection(req, res, work, method);
      return;
    }
    const [id, ...tail] = rest.split('/');
    if (!id) {
      writeJson(res, 404, { error: 'Not found' });
      return;
    }
    await handleWorkItem(req, res, work, decodeURIComponent(id), tail.join('/') || undefined, method);
  } catch (err) {
    writeJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}
