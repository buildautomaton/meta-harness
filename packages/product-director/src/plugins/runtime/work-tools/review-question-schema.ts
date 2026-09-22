import { INTERVIEW_CHOICE_SCHEMA, REVIEW_CHOICE_SCHEMA } from './choice-schema.js';

export const REVIEW_QUESTION_ITEM = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'prompt', 'choices'],
  properties: {
    id: { type: 'string', description: 'Stable id for this question' },
    prompt: {
      type: 'string',
      description:
        'Ask about an important decision that was made or still needs review. Shown under the preview. Do not put this questionnaire in the HTML.',
    },
    choices: {
      type: 'array',
      minItems: 2,
      maxItems: 6,
      description:
        '2–6 answers. Include one status_quo (keep what was built) and mark exactly one choice recommended: true. Only change answers get prompt and context.',
      items: REVIEW_CHOICE_SCHEMA,
    },
  },
};

export const INTERVIEW_QUESTION_ITEM = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'prompt', 'context', 'choices'],
  properties: {
    id: { type: 'string', description: 'Stable id for this question' },
    prompt: {
      type: 'string',
      description:
        'Exactly one question about the draft plan (single-select or multi-select). Shown on the draft card.',
    },
    context: {
      type: 'string',
      description: 'Why this question matters for the plan. Stored with the answer as a decision.',
    },
    choices: {
      type: 'array',
      minItems: 2,
      maxItems: 6,
      description:
        '2–6 concrete options. Mark the recommended choice with recommended: true. Always include a write-in / Something else option.',
      items: INTERVIEW_CHOICE_SCHEMA,
    },
  },
};
