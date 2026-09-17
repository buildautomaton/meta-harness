import type { PluginKind } from '@/types/plugin.js';
import type { WorkImplementation } from '@/types/work/implementation.js';

export type ResolvedHttpEndpoint = {
  path: string;
  kind: PluginKind;
  surface?: string;
  work?: WorkImplementation;
};

export function matchEndpoint<T extends { path: string }>(
  endpoints: readonly T[],
  pathname: string,
): T | undefined {
  const hits = endpoints.filter((e) => pathname === e.path || pathname.startsWith(`${e.path}/`));
  return [...hits].sort((a, b) => b.path.length - a.path.length)[0];
}
