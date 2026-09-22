export const CHOICE_KIND_SCHEMA = {
  type: 'string',
  enum: ['status_quo', 'change'],
  description:
    'status_quo: keep what was built — shows a "No changes" badge and queues no work. change: needs new agent work; only then include prompt and context. Be aggressive: if the answer accepts the built decision, use status_quo.',
};

export const RECOMMENDED_SCHEMA = {
  type: 'boolean',
  description:
    'True for the suggested choice (UI shows Recommended). Mark exactly one choice per question. May be the status_quo or a change.',
};

export const REVIEW_CHOICE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'label', 'kind'],
  properties: {
    id: { type: 'string', description: 'Stable id for this choice' },
    label: {
      type: 'string',
      description:
        'Choice shown to the reviewer. For status_quo, say clearly it keeps what was built (that answer gets the No changes badge).',
    },
    kind: CHOICE_KIND_SCHEMA,
    recommended: RECOMMENDED_SCHEMA,
    prompt: {
      type: 'string',
      description:
        'Required when kind is change: follow-up work to queue if this answer is chosen. Omit for status_quo.',
    },
    context: {
      type: 'string',
      description:
        'Required when kind is change: brief so a follow-up agent can do that work without the original session. Omit for status_quo.',
    },
  },
};

export const INTERVIEW_CHOICE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'label'],
  properties: {
    id: { type: 'string', description: 'Stable id for this choice' },
    label: { type: 'string', description: 'Choice shown on the draft card' },
    recommended: RECOMMENDED_SCHEMA,
  },
};
