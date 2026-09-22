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
      maxItems: 4,
      description:
        'Two to four answers. Almost every question must include one status_quo answer (keep what was built: No changes badge, no queued work). Omit status_quo only in rare cases where every option needs new work. Be aggressive about tagging keep/accept answers as status_quo. Only change answers get prompt and context.',
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
    prompt: { type: 'string', description: 'Ask about the draft plan. Shown on the draft card.' },
    context: {
      type: 'string',
      description: 'Why this question matters for the plan. Stored with the answer as a decision.',
    },
    choices: {
      type: 'array',
      minItems: 2,
      maxItems: 4,
      description: 'Two to four answers',
      items: INTERVIEW_CHOICE_SCHEMA,
    },
  },
};
