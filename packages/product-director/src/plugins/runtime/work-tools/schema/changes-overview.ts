export const CHANGES_OVERVIEW_PATH_SCHEMA = {
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

export const CHANGES_OVERVIEW_GROUP_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['description', 'paths'],
  properties: {
    description: {
      type: 'string',
      description:
        '1–2 plain-language lines: what changed in these paths and why it matters to the overall intention.',
    },
    paths: {
      type: 'array',
      minItems: 1,
      maxItems: 8,
      description: 'Files or folders in this change set. Prefer folders when a directory moved together.',
      items: CHANGES_OVERVIEW_PATH_SCHEMA,
    },
  },
};

export const CHANGES_OVERVIEW_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['groups'],
  properties: {
    groups: {
      type: 'array',
      minItems: 1,
      maxItems: 12,
      description:
        'Grouped significant path changes. One group per coherent set of related file/folder edits.',
      items: CHANGES_OVERVIEW_GROUP_SCHEMA,
    },
  },
};
