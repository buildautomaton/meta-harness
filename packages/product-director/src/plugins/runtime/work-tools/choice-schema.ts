export const CHOICE_KIND_SCHEMA = {
  type: 'string',
  enum: ['status_quo', 'change'],
  description:
    'status_quo keeps the decision already built and queues no work (no changes). change needs new agent work; only then include prompt and context.',
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
        'Choice shown to the reviewer. For status_quo, make clear it keeps what was built (no changes).',
    },
    kind: CHOICE_KIND_SCHEMA,
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
  },
};
