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

export const SUMMARY_PATH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['path', 'change'],
  properties: {
    path: {
      type: 'string',
      description:
        'Significant file or folder. Prefer a folder when many files there changed. Skip trivial edits.',
    },
    change: {
      type: 'string',
      enum: ['added', 'modified', 'removed'],
      description: 'How this path changed',
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
    paths: {
      type: 'array',
      maxItems: 12,
      description:
        'Only the main files or folders that changed. Prefer folders when a whole directory moved together.',
      items: SUMMARY_PATH_SCHEMA,
    },
  },
};
