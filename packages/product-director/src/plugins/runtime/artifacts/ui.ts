import type { ArtifactBuildContext } from '@/types/artifact/kind.js';
import type { UiPageInput } from '@/types/work/submit.js';
import { artifactPlugin } from './define.js';
import { file } from '@plugins/runtime/work/artifacts/file.js';
import { embedAssetsInHtml } from '@plugins/runtime/work/artifacts/embed-assets.js';
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
      'ui: one self-contained HTML document per changed screen, or a changed component when the scope was smaller. Match type, color, spacing, and the app design system. Fill with realistic mock data (real names). Highlight the change. Include the product’s own controls. Icons/images go in assets.',
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
  if (!filename || !title || !html || !filename.endsWith('.html')) return undefined;
  return { filename, title, html, whatChanged: str(row?.whatChanged) };
}

function buildUiFiles(payload: unknown, ctx: ArtifactBuildContext) {
  const pages = (payload as { pages?: UiPageInput[] }).pages ?? [];
  return pages.map((page) => file(`ui/${page.filename}`, embedAssetsInHtml(page.html, ctx.assets)));
}
