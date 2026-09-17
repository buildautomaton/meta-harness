import type { ArtifactFile } from '@/types/work/artifact.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { WorkAssetInput } from '@/types/work/events.js';
import { file } from './file.js';
import { buildNonUiFiles } from './non-ui.js';
import { buildQuestionsFile } from './questions-file.js';
import { embedAssetsInHtml } from './embed-assets.js';
import { outlineHtml, outlineMarkdown } from './outline-pages.js';
import { dataUri } from './embed-assets.js';

export function buildArtifactFiles(
  input: SubmitWorkInput,
  recordedAt: string,
  assets: WorkAssetInput[] = [],
): ArtifactFile[] {
  const files: ArtifactFile[] = [
    file('description.md', `${input.description}\n`),
    file('manifest.json', `${JSON.stringify(manifest(input, recordedAt), null, 2)}\n`),
  ];
  if (input.ui) {
    for (const page of input.ui.pages) {
      files.push(file(`ui/${page.filename}`, embedAssetsInHtml(page.html, assets)));
    }
  }
  files.push(...buildNonUiFiles(input));
  if (input.outline) {
    files.push(file('outline.md', outlineMarkdown(input.outline)));
    files.push(file('outline.html', outlineHtml(input.title, input.outline)));
  }
  for (const asset of assets) {
    files.push(file(`assets/${asset.filename}`, dataUri(asset), asset.mimeType));
  }
  files.push(...buildQuestionsFile(input));
  return files;
}

function manifest(input: SubmitWorkInput, recordedAt: string) {
  return {
    title: input.title,
    recordedAt,
    sessionId: input.sessionId ?? null,
    turnId: input.turnId ?? null,
    kinds: {
      ui: Boolean(input.ui),
      api: Boolean(input.api),
      algorithm: Boolean(input.algorithm),
      dataModel: Boolean(input.dataModel),
      moduleStructure: Boolean(input.moduleStructure),
      backend: Boolean(input.backend),
      outline: Boolean(input.outline),
    },
  };
}
