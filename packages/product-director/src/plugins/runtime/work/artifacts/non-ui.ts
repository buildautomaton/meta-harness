import type { ArtifactFile } from '@/types/work/artifact.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';
import { file } from './file.js';
import { algorithmHtml, algorithmMarkdown } from './algorithm-pages.js';
import { apiHtml, apiMarkdown, backendHtml, mermaidMarkdown } from './text-pages.js';
import { wrapMermaidPage } from './html/wrap-mermaid.js';

function pair(base: string, markdown: string, html: string): ArtifactFile[] {
  return [file(`${base}.md`, markdown), file(`${base}.html`, html)];
}

export function buildNonUiFiles(input: SubmitWorkInput): ArtifactFile[] {
  const files: ArtifactFile[] = [];
  if (input.api) files.push(...pair('api', apiMarkdown(input.api), apiHtml(input.title, input.api)));
  if (input.algorithm) {
    files.push(...pair('algorithm', algorithmMarkdown(input.algorithm), algorithmHtml(input.algorithm)));
  }
  if (input.dataModel) {
    files.push(
      ...pair(
        'data-model',
        mermaidMarkdown(input.dataModel.whatChanged, input.dataModel.mermaid),
        wrapMermaidPage({
          title: `${input.title} data model`,
          kicker: 'Data model',
          whatChanged: input.dataModel.whatChanged,
          mermaid: input.dataModel.mermaid,
        }),
      ),
    );
  }
  if (input.moduleStructure) {
    files.push(
      ...pair(
        'module-structure',
        mermaidMarkdown(input.moduleStructure.whatChanged, input.moduleStructure.mermaid),
        wrapMermaidPage({
          title: `${input.title} modules`,
          kicker: 'Module structure',
          whatChanged: input.moduleStructure.whatChanged,
          mermaid: input.moduleStructure.mermaid,
        }),
      ),
    );
  }
  if (input.backend) {
    files.push(...pair('backend', `${input.backend.description}\n`, backendHtml(input.title, input.backend.description)));
  }
  return files;
}
