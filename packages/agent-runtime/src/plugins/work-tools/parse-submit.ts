import type { SubmitWorkInput, UiPageInput, ApiRouteInput } from '@/types/work/submit.js';
import { parseNamed, parseDiagram, parseBackend, parseQuestions } from './parse-parts.js';
import { parseAssets, parseOutline } from './parse-extra.js';

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function obj(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function parseSubmitWork(args: Record<string, unknown>): SubmitWorkInput | string {
  const title = str(args.title);
  const description = str(args.description);
  if (!title || !description) return 'title and description are required';
  return {
    title,
    description,
    sessionId: str(args.sessionId),
    turnId: str(args.turnId),
    ui: parseUi(args.ui),
    api: parseApi(args.api),
    algorithm: parseNamed(args.algorithm),
    dataModel: parseDiagram(args.dataModel),
    moduleStructure: parseDiagram(args.moduleStructure),
    backend: parseBackend(args.backend),
    outline: parseOutline(args.outline),
    assets: parseAssets(args.assets),
    questions: parseQuestions(args.questions),
  };
}

function parseUi(value: unknown): SubmitWorkInput['ui'] {
  const pages = obj(value)?.pages;
  if (!Array.isArray(pages) || pages.length === 0) return undefined;
  const mapped = pages.map(parsePage).filter((p): p is UiPageInput => p !== undefined);
  return mapped.length ? { pages: mapped } : undefined;
}

function parsePage(value: unknown): UiPageInput | undefined {
  const row = obj(value);
  const filename = str(row?.filename);
  const title = str(row?.title);
  const html = str(row?.html);
  if (!filename || !title || !html || !filename.endsWith('.html')) return undefined;
  return { filename, title, html, whatChanged: str(row?.whatChanged) };
}

function parseApi(value: unknown): SubmitWorkInput['api'] {
  const routes = obj(value)?.routes;
  if (!Array.isArray(routes) || routes.length === 0) return undefined;
  const mapped = routes.map(parseRoute).filter((r): r is ApiRouteInput => r !== undefined);
  return mapped.length ? { routes: mapped } : undefined;
}

function parseRoute(value: unknown): ApiRouteInput | undefined {
  const row = obj(value);
  const method = str(row?.method) as ApiRouteInput['method'] | undefined;
  const path = str(row?.path);
  const change = str(row?.change) as ApiRouteInput['change'] | undefined;
  const description = str(row?.description);
  if (!method || !path || !change || !description) return undefined;
  return { method, path, change, description };
}
