import type { IncomingMessage, ServerResponse } from 'node:http';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { dispatchWorkHttp } from './dispatch.js';

export function createWorkHttpHandler(work: WorkImplementation) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    const pathname = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
    if (!pathname.startsWith('/api/work') && !pathname.startsWith('/api/artifacts')) return false;
    await dispatchWorkHttp(req, res, work, pathname);
    return true;
  };
}
