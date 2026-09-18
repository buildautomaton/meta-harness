export const DATA_MODEL_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['mermaid', 'whatChanged'],
  properties: {
    mermaid: {
      type: 'string',
      description:
        'Mermaid erDiagram or classDiagram of the data model after the change. Use this product’s real entities, fields, and relationships — not generic User/Item examples unless those are the domain.',
    },
    whatChanged: {
      type: 'string',
      description: 'What changed in the data model versus before (entities, fields, relations added, removed, or renamed).',
    },
  },
};

export const MODULE_STRUCTURE_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['mermaid', 'whatChanged'],
  properties: {
    mermaid: {
      type: 'string',
      description:
        'Mermaid flowchart, graph, or classDiagram of the modules after the change. Use the real module and package names from this codebase. The diagram does not need a review questionnaire; pass module questions in questions.modules.',
    },
    whatChanged: {
      type: 'string',
      description: 'What changed in the module structure versus before, naming the real modules that moved, split, or were added.',
    },
  },
};
