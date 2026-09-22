import type { ArtifactFile } from '@/types/work/artifact.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';
import { file } from './file.js';
import { algorithmHtml, algorithmMarkdown } from './algorithm-pages.js';
import { apiHtml, apiMarkdown, mermaidMarkdown } from './text-pages.js';
import { summaryHtml, summaryMarkdown } from './summary-pages.js';
import { wrapMermaidPage } from './html/wrap-mermaid.js';

function pair(base: string, markdown: string, html: string): ArtifactFile[] {
  return [file(`${base}.md`, markdown), file(`${base}.html`, html)];
}

export function buildNonUiFiles(input: SubmitWorkInput): ArtifactFile[] {
  const files: ArtifactFile[] = [];
  if (input.summary) {
    files.push(...pair('summary', summaryMarkdown(input.summary), summaryHtml(input.title, input.summary)));
  }
  if (input.api) files.push(...pair('api', apiMarkdown(input.api), apiHtml(input.title, input.api)));
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
          highlights: input.dataModel.highlights,
        }),
      ),
    );
  }
  if (input.algorithm) {
    files.push(...pair('algorithm', algorithmMarkdown(input.algorithm), algorithmHtml(input.algorithm)));
  }
  return files;
}
