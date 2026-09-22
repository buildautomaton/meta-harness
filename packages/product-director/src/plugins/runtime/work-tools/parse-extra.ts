import type { WorkAssetInput } from '@/types/work/events.js';

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function obj(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
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
