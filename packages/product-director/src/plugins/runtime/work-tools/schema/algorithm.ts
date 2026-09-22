export const ALGORITHM_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'whatChanged', 'pseudocode'],
  properties: {
    name: { type: 'string', description: 'Name of the algorithm as it is known in this product' },
    whatChanged: {
      type: 'string',
      description: 'What changed in the algorithm versus before, in this product’s domain terms',
    },
    pseudocode: {
      type: 'string',
      description:
        'Pseudocode of the algorithm after the change. Use this product’s real steps, entities, and field names — not a generic textbook example.',
    },
  },
};
