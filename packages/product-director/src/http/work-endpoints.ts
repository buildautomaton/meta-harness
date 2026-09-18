import { HTTP_DEFAULT_WORK_ROOT, type TransportEndpoint } from '@buildautomaton/agent-runtime';

export function workHttpEndpoints(
  plugin: string,
  root = HTTP_DEFAULT_WORK_ROOT,
  routes?: Record<string, string>,
): TransportEndpoint[] {
  return [{ path: root, plugin, routes }];
}
