import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { writeJson } from './io.js';
import { handleWorkCollection } from './collection.js';
import { handleWorkItem } from './item.js';

export async function dispatchWorkHttp(
  req: IncomingMessage,
  res: ServerResponse,
  work: WorkImplementation,
  pathname: string,
): Promise<void> {
  try {
    const method = req.method ?? 'GET';
    if (pathname === '/api/work' || pathname === '/api/work/') {
      await handleWorkCollection(req, res, work, method);
      return;
    }
    if (pathname === '/api/artifacts' || pathname === '/api/artifacts/') {
      writeJson(res, 200, await work.listArtifacts());
      return;
    }
    const artifact = /^\/api\/artifacts\/([^/]+)(?:\/(.*))?$/.exec(pathname);
    if (artifact) {
      await handleWorkItem(req, res, work, 'artifacts', `${artifact[1]}${artifact[2] ? `/${artifact[2]}` : ''}`, method);
      return;
    }
    const item = /^\/api\/work\/([^/]+)(?:\/(.*))?$/.exec(pathname);
    if (!item) {
      writeJson(res, 404, { error: 'Not found' });
      return;
    }
    await handleWorkItem(req, res, work, decodeURIComponent(item[1]!), item[2], method);
  } catch (err) {
    writeJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}
