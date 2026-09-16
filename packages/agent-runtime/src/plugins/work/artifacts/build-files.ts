import type { ArtifactFile } from '@/types/work/artifact.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';
import { file } from './file.js';
import { buildNonUiFiles } from './non-ui.js';
import { buildQuestionsFile } from './questions-file.js';

export function buildArtifactFiles(input: SubmitWorkInput, recordedAt: string): ArtifactFile[] {
  const files: ArtifactFile[] = [
    file('description.md', `${input.description}\n`),
    file(
      'manifest.json',
      `${JSON.stringify(
        {
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
          },
        },
        null,
        2,
      )}\n`,
    ),
  ];
  if (input.ui) {
    for (const page of input.ui.pages) files.push(file(`ui/${page.filename}`, page.html));
  }
  files.push(...buildNonUiFiles(input));
  files.push(...buildQuestionsFile(input));
  return files;
}
