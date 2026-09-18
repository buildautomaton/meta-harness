import type { ApiRouteInput } from '@/types/work/submit.js';
import { artifactPlugin } from './define.js';
import { pair } from './pair.js';
import { apiHtml, apiMarkdown } from '@plugins/work/artifacts/text-pages.js';
import { API_ARTIFACT_SCHEMA } from '@plugins/work-tools/schema/api.js';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'WEBSOCKET'] as const;

function obj(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const apiArtifactPlugin = () =>
  artifactPlugin('artifact-api', {
    key: 'api',
    description:
      'api: every HTTP route added, modified, or removed — real paths from this app, with method, path, and what changed.',
    instructions: 'API artifacts must use this product’s real routes and methods, not sample /api/example paths.',
    schema: API_ARTIFACT_SCHEMA,
    parse: parseApi,
    buildFiles: (payload, ctx) => {
      const api = payload as { routes: ApiRouteInput[] };
      return pair('api', apiMarkdown(api), apiHtml(String(ctx.title), api));
    },
  });

function parseApi(value: unknown): { routes: ApiRouteInput[] } | undefined {
  const routes = obj(value)?.routes;
  if (!Array.isArray(routes) || routes.length === 0) return undefined;
  const mapped = routes.map(parseRoute).filter((r): r is ApiRouteInput => r !== undefined);
  return mapped.length ? { routes: mapped } : undefined;
}

function parseRoute(value: unknown): ApiRouteInput | undefined {
  const row = obj(value);
  const method = str(row?.method);
  const path = str(row?.path);
  const change = str(row?.change) as ApiRouteInput['change'] | undefined;
  const description = str(row?.description);
  if (!method || !path || !change || !description) return undefined;
  if (!METHODS.includes(method as (typeof METHODS)[number])) return undefined;
  return { method: method as ApiRouteInput['method'], path, change, description };
}
