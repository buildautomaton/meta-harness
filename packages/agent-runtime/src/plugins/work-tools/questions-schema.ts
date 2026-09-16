const questionItem = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'prompt', 'context', 'choices'],
  properties: {
    id: { type: 'string', description: 'Stable id for this question' },
    prompt: {
      type: 'string',
      description:
        'Ask about a design decision on this item. Shown to a person under the preview. The HTML does not need to include this questionnaire.',
    },
    context: {
      type: 'string',
      description:
        'Starting brief for a follow-up agent. Combined with the chosen answer, they should know how to do the work without the original session. Include what was built, where it lives, and what the answer should change. Do not put this in the prompt shown to the person.',
    },
    choices: {
      type: 'array',
      minItems: 2,
      maxItems: 4,
      description: 'Two to four answers, including keep vs change options when relevant',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'label'],
        properties: {
          id: { type: 'string', description: 'Stable id for this choice' },
          label: { type: 'string', description: 'Choice shown to the reviewer' },
        },
      },
    },
  },
};

const questionList = {
  type: 'array',
  maxItems: 3,
  items: questionItem,
  description:
    'Up to 3 multiple-choice questions the dashboard shows below a preview so a person can answer. Each needs a brief context for a follow-up agent. The HTML and diagrams do not need to include this questionnaire.',
};

export const QUESTIONS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  description:
    'Review questions for a person. The dashboard renders these below the matching preview. The HTML and diagrams do not need to include this questionnaire.',
  properties: {
    overview: {
      ...questionList,
      description: 'Up to 3 questions about the overall work. Shown under Overview. The HTML does not need to include them.',
    },
    modules: {
      ...questionList,
      description:
        'Up to 3 questions about module design. Shown under Overview. The module diagram does not need to include them.',
    },
    ui: {
      type: 'array',
      description:
        'Questions for each UI screen or component. filename must match a ui.pages entry. Shown below that preview; the HTML does not need to include them.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['filename', 'questions'],
        properties: {
          filename: { type: 'string', description: 'Must match a ui.pages filename, e.g. checkout.html' },
          questions: questionList,
        },
      },
    },
  },
};
