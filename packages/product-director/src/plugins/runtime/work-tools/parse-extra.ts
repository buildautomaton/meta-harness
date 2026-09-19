import type { OutlineArtifactInput, OutlineViewInput } from '@/types/work/outline.js';
import type { WorkAssetInput } from '@/types/work/events.js';
import { OUTLINE_VIEW_KINDS } from '@/types/work/outline.js';

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function obj(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function parseOutline(value: unknown): OutlineArtifactInput | undefined {
  const row = obj(value);
  const whatChanged = str(row?.whatChanged);
  if (!whatChanged || !Array.isArray(row?.views)) return undefined;
  const views = row.views.map(parseView).filter((v): v is OutlineViewInput => v !== undefined);
  return views.length ? { whatChanged, views } : undefined;
}

function parseView(value: unknown): OutlineViewInput | undefined {
  const row = obj(value);
  const kind = str(row?.kind) as OutlineViewInput['kind'] | undefined;
  const title = str(row?.title);
  const content = str(row?.content);
  if (!kind || !title || !content || !OUTLINE_VIEW_KINDS.includes(kind)) return undefined;
  return { kind, title, content };
}

export function parseAssets(value: unknown): WorkAssetInput[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const assets = value
    .map((item) => {
      const row = obj(item);
      const filename = str(row?.filename);
      const mimeType = str(row?.mimeType);
      const base64 = str(row?.base64);
      return filename && mimeType && base64 ? { filename, mimeType, base64 } : undefined;
    })
    .filter((item): item is WorkAssetInput => item !== undefined);
  return assets.length ? assets : undefined;
}
