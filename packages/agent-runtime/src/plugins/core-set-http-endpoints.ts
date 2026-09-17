import type { CoreSetOptions } from './core-set.js';
import type { TransportEndpoint } from '@/types/transport/endpoints.js';
import { MCP_DEFAULT_PATH } from './transport/http/http-path.js';
import { workHttpEndpoints } from './transport/http/work-endpoints.js';

export function coreHttpEndpoints(opts: CoreSetOptions): TransportEndpoint[] {
  const tools: TransportEndpoint = { kind: 'tools', path: opts.mcpPath ?? MCP_DEFAULT_PATH };
  if (opts.work === false) return [tools];
  return [tools, ...workHttpEndpoints(opts.workPlugin ?? 'work-sqlite', opts.workRoot)];
}
