import type { ArtifactBuildContext } from '@/types/artifact/kind.js';
import type { UiBannerInput, UiPageInput } from '@/types/work/submit.js';
import type { ChangeKind } from '@/types/work/change.js';
import { CHANGE_KINDS } from '@/types/work/change.js';
import { artifactPlugin } from './define.js';
import { file } from '@plugins/runtime/work/artifacts/file.js';
import { embedAssetsInHtml } from '@plugins/runtime/work/artifacts/embed-assets.js';
import { wrapUiPreview } from '@plugins/runtime/work/artifacts/ui-banner.js';
import { UI_ARTIFACT_SCHEMA } from '@plugins/runtime/work-tools/schema/ui.js';
import { UI_INSTRUCTIONS } from '@plugins/runtime/work-tools/schema/ui-copy.js';

function obj(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const uiArtifactPlugin = () =>
  artifactPlugin('artifact-ui', {
    key: 'ui',
    description:
      'ui: one self-contained HTML mockup per changed screen or component, matching the app design system. Pass banner: { change, text } as JSON — formatting is applied for you; no New badges in the HTML.',
    instructions: UI_INSTRUCTIONS,
    schema: UI_ARTIFACT_SCHEMA,
    parse: parseUi,
    buildFiles: (payload, ctx) => buildUiFiles(payload, ctx),
  });

function parseUi(value: unknown): { pages: UiPageInput[] } | undefined {
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
  const banner = parseBanner(row?.banner);
  if (!filename || !title || !html || !banner || !filename.endsWith('.html')) return undefined;
  return { filename, title, html, banner };
}

function parseBanner(value: unknown): UiBannerInput | undefined {
  const row = obj(value);
  const text = str(row?.text);
  const change = str(row?.change) as ChangeKind | undefined;
  if (!text || !change || !CHANGE_KINDS.includes(change)) return undefined;
  return { change, text };
}

function buildUiFiles(payload: unknown, ctx: ArtifactBuildContext) {
  const pages = (payload as { pages?: UiPageInput[] }).pages ?? [];
  return pages.map((page) => {
    const embedded = embedAssetsInHtml(page.html, ctx.assets);
    return file(`ui/${page.filename}`, wrapUiPreview(embedded, page.banner));
  });
}
