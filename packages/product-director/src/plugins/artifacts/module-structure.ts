import { artifactPlugin } from './define.js';
import { pair } from './pair.js';
import { mermaidMarkdown } from '@plugins/work/artifacts/text-pages.js';
import { wrapMermaidPage } from '@plugins/work/artifacts/html/wrap-mermaid.js';
import { MODULE_STRUCTURE_ARTIFACT_SCHEMA } from '@plugins/work-tools/schema/diagrams.js';
import { parseDiagram } from '@plugins/work-tools/parse-parts.js';

export const moduleStructureArtifactPlugin = () =>
  artifactPlugin('artifact-module-structure', {
    key: 'moduleStructure',
    description:
      'moduleStructure: Mermaid of the modules after the change, with real module names. Module questions go in questions.modules.',
    instructions: 'Module-structure diagrams must use this product’s real module names.',
    schema: MODULE_STRUCTURE_ARTIFACT_SCHEMA,
    parse: parseDiagram,
    buildFiles: (payload, ctx) => {
      const model = payload as { mermaid: string; whatChanged: string };
      return pair(
        'module-structure',
        mermaidMarkdown(model.whatChanged, model.mermaid),
        wrapMermaidPage({
          title: `${ctx.title} modules`,
          kicker: 'Module structure',
          whatChanged: model.whatChanged,
          mermaid: model.mermaid,
        }),
      );
    },
  });
