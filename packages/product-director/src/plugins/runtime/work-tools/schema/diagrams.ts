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
      description:
        '2–3 plain-language sentences on what changed in the data model versus before.',
    },
    highlights: {
      type: 'array',
      description:
        'Entities, properties, or relationships to color in the diagram. Green=added, yellow=modified, red=removed.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['ref', 'change'],
        properties: {
          ref: {
            type: 'string',
            description:
              'Entity name, Entity.field for a property, or Entity--Other for a relationship.',
          },
          change: {
            type: 'string',
            enum: ['added', 'modified', 'removed'],
            description: 'added=green, modified=yellow, removed=red',
          },
        },
      },
    },
  },
};
