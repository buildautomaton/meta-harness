export const OUTLINE_VIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'title', 'content'],
  properties: {
    kind: {
      type: 'string',
      enum: ['component-tree', 'file-tree', 'call-tree', 'pseudocode', 'flow', 'diff'],
      description: 'The /show-me view that best shows this part of the change',
    },
    title: { type: 'string', description: 'Short label for this view' },
    content: {
      type: 'string',
      description:
        'The view body: a tree, unified diff, pseudocode, or Mermaid. Prefer diff notation when the surrounding shape already exists.',
    },
  },
};

export const OUTLINE_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['whatChanged', 'views'],
  properties: {
    whatChanged: {
      type: 'string',
      description: 'One or two sentences on what changed versus before, naming real modules and surfaces',
    },
    views: {
      type: 'array',
      minItems: 1,
      maxItems: 6,
      description: 'Compact structural views of the change. Omit categories that did not change.',
      items: OUTLINE_VIEW_SCHEMA,
    },
  },
};
