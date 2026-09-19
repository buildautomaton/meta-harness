import { artifactPlugin } from './define.js';
import { pair } from './pair.js';
import { mermaidMarkdown } from '@plugins/runtime/work/artifacts/text-pages.js';
import { wrapMermaidPage } from '@plugins/runtime/work/artifacts/html/wrap-mermaid.js';
import { DATA_MODEL_ARTIFACT_SCHEMA } from '@plugins/runtime/work-tools/schema/diagrams.js';
import { parseDiagram } from '@plugins/runtime/work-tools/parse-parts.js';

export const dataModelArtifactPlugin = () =>
  artifactPlugin('artifact-data-model', {
    key: 'dataModel',
    description:
      'dataModel: Mermaid erDiagram or classDiagram of the model after the change, with real entities, fields, and relations.',
    instructions: 'Data-model diagrams must use this product’s real entity and field names.',
    schema: DATA_MODEL_ARTIFACT_SCHEMA,
    parse: parseDiagram,
    buildFiles: (payload, ctx) => {
      const model = payload as { mermaid: string; whatChanged: string };
      return pair(
        'data-model',
        mermaidMarkdown(model.whatChanged, model.mermaid),
        wrapMermaidPage({
          title: `${ctx.title} data model`,
          kicker: 'Data model',
          whatChanged: model.whatChanged,
          mermaid: model.mermaid,
        }),
      );
    },
  });
