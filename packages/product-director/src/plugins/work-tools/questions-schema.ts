import { INTERVIEW_QUESTION_ITEM, REVIEW_QUESTION_ITEM } from './review-question-schema.js';

const reviewList = {
  type: 'array',
  items: REVIEW_QUESTION_ITEM,
  description:
    'Important decisions only. Aim for about 10 questions across overview, modules, and UI combined. Prefer fewer; do not pad.',
};

export const QUESTIONS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  description:
    'Review questions after work is complete. Ask only high-quality, important decisions that were made or still need a person to review. Aim for about 10 total, preferring fewer. Shown below the matching preview; HTML and diagrams do not include this questionnaire.',
  properties: {
    overview: {
      ...reviewList,
      description: 'Important overall decisions. Shown under Overview.',
    },
    modules: {
      ...reviewList,
      description: 'Important module-design decisions. Shown under Overview.',
    },
    ui: {
      type: 'array',
      description: 'Questions for each UI screen or component. filename must match a ui.pages entry.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['filename', 'questions'],
        properties: {
          filename: { type: 'string', description: 'Must match a ui.pages filename, e.g. checkout.html' },
          questions: reviewList,
        },
      },
    },
  },
};

export const INTERVIEW_QUESTIONS_SCHEMA = {
  type: 'array',
  maxItems: 4,
  items: INTERVIEW_QUESTION_ITEM,
  description:
    '2–4 multiple-choice questions for the draft card, or [] when the interview is done and the work should be queued. Each answer is stored as a decision bullet on the work item.',
};
