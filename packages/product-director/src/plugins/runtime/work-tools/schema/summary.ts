export const SUMMARY_AREA_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['area', 'description'],
  properties: {
    area: {
      type: 'string',
      description: 'Codebase area that changed, e.g. Backend, Frontend, Modules, Infra.',
    },
    description: {
      type: 'string',
      description: 'At most 2–3 plain-language sentences on what changed in this area. No jargon dumps.',
    },
  },
};

export const SUMMARY_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['areas'],
  properties: {
    areas: {
      type: 'array',
      minItems: 1,
      maxItems: 8,
      description:
        'One entry per codebase area that changed (backend, frontend, modules, etc.). Omit areas with no change.',
      items: SUMMARY_AREA_SCHEMA,
    },
  },
};
