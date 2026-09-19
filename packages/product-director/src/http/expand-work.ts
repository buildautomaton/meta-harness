import { joinHttpPath } from '@buildautomaton/runtime';

export type ExpandedEndpoint = { path: string; plugin?: string; surface?: string };

export function expandWorkMount(endpoint: {
  path: string;
  plugin?: string;
  routes?: Record<string, string>;
}): ExpandedEndpoint[] {
  const work = endpoint.routes?.work ?? 'work';
  const artifacts = endpoint.routes?.artifacts ?? 'artifacts';
  const assets = endpoint.routes?.assets ?? 'assets';
  const workPath = joinHttpPath(endpoint.path, work);
  return [
    { ...endpoint, path: workPath },
    { ...endpoint, path: joinHttpPath(endpoint.path, artifacts), surface: 'artifacts' },
    { ...endpoint, path: joinHttpPath(endpoint.path, assets), surface: 'assets' },
    { ...endpoint, path: joinHttpPath(workPath, 'events'), surface: 'events' },
  ];
}
