import type { TransportEndpoint } from '@/types/transport/endpoints.js';
import { normalizeHttpPath } from './http-path.js';

export type ExpandedEndpoint = TransportEndpoint & { surface?: string };

export function joinHttpPath(root: string, segment: string): string {
  const clean = segment.replace(/^\/+/, '').replace(/\/+$/, '');
  const base = normalizeHttpPath(root);
  return base === '/' ? `/${clean}` : `${base}/${clean}`;
}

export function expandWorkMount(endpoint: TransportEndpoint): ExpandedEndpoint[] {
  if (endpoint.kind !== 'work') return [endpoint];
  const work = endpoint.routes?.work ?? 'work';
  const artifacts = endpoint.routes?.artifacts ?? 'artifacts';
  return [
    { ...endpoint, path: joinHttpPath(endpoint.path, work) },
    { ...endpoint, path: joinHttpPath(endpoint.path, artifacts), surface: 'artifacts' },
  ];
}
