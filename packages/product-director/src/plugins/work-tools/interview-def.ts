import type { McpToolDefinition } from '@buildautomaton/agent-runtime';
import { ASK_PRODUCT_DIRECTOR_INTERVIEW_QUESTIONS } from './names.js';
import { ASK_PRODUCT_DIRECTOR_INTERVIEW_DESCRIPTION } from './descriptions.js';
import { INTERVIEW_QUESTIONS_SCHEMA } from './questions-schema.js';

export const ASK_PRODUCT_DIRECTOR_INTERVIEW_QUESTIONS_DEFINITION: McpToolDefinition = {
  name: ASK_PRODUCT_DIRECTOR_INTERVIEW_QUESTIONS,
  title: 'Ask interview questions on a draft',
  description: ASK_PRODUCT_DIRECTOR_INTERVIEW_DESCRIPTION,
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['workId', 'questions'],
    properties: {
      workId: { type: 'string', description: 'Draft work id from ask_product_director_what_to_build_next' },
      sessionId: { type: 'string', description: 'Interview session ID from ask_product_director_what_to_build_next' },
      questions: INTERVIEW_QUESTIONS_SCHEMA,
    },
  },
};
