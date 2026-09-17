import type { McpToolDefinition } from '@/types/tools/definitions.js';
import { ASK_INTERVIEW_QUESTIONS_TOOL } from './names.js';
import { ASK_INTERVIEW_DESCRIPTION } from './descriptions.js';
import { INTERVIEW_QUESTIONS_SCHEMA } from './questions-schema.js';

export const ASK_INTERVIEW_QUESTIONS_DEFINITION: McpToolDefinition = {
  name: ASK_INTERVIEW_QUESTIONS_TOOL,
  title: 'Ask interview questions on a draft',
  description: ASK_INTERVIEW_DESCRIPTION,
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['workId', 'questions'],
    properties: {
      workId: { type: 'string', description: 'Draft work id from ask_what_to_work_on' },
      sessionId: { type: 'string', description: 'Interview session ID from ask_what_to_work_on' },
      questions: INTERVIEW_QUESTIONS_SCHEMA,
    },
  },
};
