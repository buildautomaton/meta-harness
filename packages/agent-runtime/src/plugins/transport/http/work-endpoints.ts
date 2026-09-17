import type { TransportEndpoint } from '@/types/transport/endpoints.js';
import { HTTP_DEFAULT_WORK_ROOT } from './http-path.js';

/** One work mount; the HTTP transport expands it into work + artifacts routes. */
export function workHttpEndpoints(
  plugin: string,
  root = HTTP_DEFAULT_WORK_ROOT,
  routes?: { work?: string; artifacts?: string },
): TransportEndpoint[] {
  return [{ kind: 'work', path: root, plugin, routes }];
}
