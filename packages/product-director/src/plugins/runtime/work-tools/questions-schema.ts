import { INTERVIEW_QUESTION_ITEM, REVIEW_QUESTION_ITEM } from './review-question-schema.js';

const reviewList = {
  type: 'array',
  maxItems: 3,
  items: REVIEW_QUESTION_ITEM,
  description:
    'Important decisions only. At most 3 questions total across overview, modules, and UI combined. Prefer fewer; do not pad.',
};

export const QUESTIONS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  description:
    'Review questions after work is complete. At most 3 total across overview, modules, and UI (few exceptions). Each question needs one status_quo answer (No changes badge, no queued work) and exactly one recommended choice. Shown below the matching preview; HTML and diagrams do not include this questionnaire.',
  properties: {
    overview: {
      ...reviewList,
      description: 'Important overall decisions. Shown under Overview. Count toward the 3-question limit.',
    },
    modules: {
      ...reviewList,
      description: 'Important module-design decisions. Shown under Overview. Count toward the 3-question limit.',
    },
    ui: {
      type: 'array',
      description: 'Questions for each UI screen or component. filename must match a ui.pages entry. Count toward the 3-question limit.',
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
  maxItems: 1,
  items: INTERVIEW_QUESTION_ITEM,
  description:
    'Exactly one multiple-choice question for the draft card, or [] when the interview is done and the work should be queued. Each answer is stored as a decision bullet on the work item.',
};
