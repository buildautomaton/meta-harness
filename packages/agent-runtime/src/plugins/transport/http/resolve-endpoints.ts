import type { CommandHost } from '@/types/transport/implementation.js';
import type { LogFn } from '@/types/log.js';
import type { HttpTransportOptions } from '@/types/transport/options.js';
import type { TransportEndpoint } from '@/types/transport/endpoints.js';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { MCP_DEFAULT_PATH, normalizeHttpPath } from './http-path.js';
import type { ResolvedHttpEndpoint } from './match-endpoint.js';
import { expandWorkMount, type ExpandedEndpoint } from './expand-work.js';

export function resolveHttpEndpoints(
  opts: HttpTransportOptions,
  host: CommandHost,
  log?: LogFn,
): ResolvedHttpEndpoint[] {
  const listed = opts.endpoints ?? [];
  const withTools: TransportEndpoint[] = listed.some((e) => e.kind === 'tools')
    ? listed
    : [{ kind: 'tools', path: opts.path ?? MCP_DEFAULT_PATH }, ...listed];
  return withTools.flatMap(expandWorkMount).map((e) => bindEndpoint(e, host.plugins?.work ?? {}, log));
}

function bindEndpoint(
  e: ExpandedEndpoint,
  works: Record<string, WorkImplementation>,
  log?: LogFn,
): ResolvedHttpEndpoint {
  const path = normalizeHttpPath(e.path);
  if (e.kind !== 'work') return { path, kind: e.kind };
  const work = e.plugin ? works[e.plugin] : undefined;
  if (!work) log?.(`[HTTP] No work plugin named ${e.plugin ?? '(none)'} for ${path}`);
  return { path, kind: e.kind, surface: e.surface, work };
}
