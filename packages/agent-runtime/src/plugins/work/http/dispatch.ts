import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { writeJson } from './io.js';
import { handleWorkCollection } from './collection.js';
import { handleWorkItem } from './item.js';
import { handleArtifactRoutes } from './artifact-routes.js';
import { handleAssetRoutes } from './asset-routes.js';
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
    if (surface === 'assets') {
      await handleAssetRoutes(req, res, work, rest, method);
      return;
    }
    if (surface === 'events') {
      writeJson(res, 426, { error: 'Upgrade Required' });
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
    const message = err instanceof Error ? err.message : String(err);
    writeJson(res, message === 'ANSWER_LOCKED' ? 409 : 500, { error: message });
  }
}
