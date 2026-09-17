import type { WorkAssetInput } from '@/types/work/events.js';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function dataUri(asset: WorkAssetInput): string {
  return `data:${asset.mimeType};base64,${asset.base64}`;
}

export function embedAssetsInHtml(html: string, assets: WorkAssetInput[]): string {
  let out = html;
  for (const asset of assets) {
    const uri = dataUri(asset);
    const name = escapeRegExp(asset.filename);
    out = out.replace(new RegExp(`(["'(])${name}(["')])`, 'g'), `$1${uri}$2`);
  }
  return out;
}

export function mergeAssets(fromSession: WorkAssetInput[], fromSubmit: WorkAssetInput[]): WorkAssetInput[] {
  const byName = new Map<string, WorkAssetInput>();
  for (const asset of fromSession) byName.set(asset.filename, asset);
  for (const asset of fromSubmit) byName.set(asset.filename, asset);
  return [...byName.values()];
}
