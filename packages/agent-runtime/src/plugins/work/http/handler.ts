import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { dispatchWorkHttp } from './dispatch.js';

const DEFAULT_PATHS = { work: '/api/work', artifacts: '/api/artifacts' };

export function createWorkHttpHandler(
  work: WorkImplementation,
  paths: { work: string; artifacts: string } = DEFAULT_PATHS,
) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    const pathname = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
    if (pathname === paths.work || pathname.startsWith(`${paths.work}/`)) {
      await dispatchWorkHttp(req, res, work, pathname, paths.work);
      return true;
    }
    if (pathname === paths.artifacts || pathname.startsWith(`${paths.artifacts}/`)) {
      await dispatchWorkHttp(req, res, work, pathname, paths.artifacts, 'artifacts');
      return true;
    }
    return false;
  };
}
