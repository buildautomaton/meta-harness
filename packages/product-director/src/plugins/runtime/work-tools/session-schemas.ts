/** Opaque build-session handle returned in structuredContent and accepted as sessionId. */
export const SESSION_ID_PROPERTY = {
  type: 'string',
  description:
    'Opaque state handle for this build session (MCP explicit state handle). Pass as sessionId on tell_product_director_what_was_built and reuse on every tell in this session. Do not invent a new value.',
};

export const ASK_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['sessionId'],
  properties: {
    sessionId: SESSION_ID_PROPERTY,
    interviewSessionId: {
      type: 'string',
      description:
        'Present when drafts need interviewing. Pass as sessionId on ask_product_director_interview_questions.',
    },
  },
};

export const TELL_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['artifactId'],
  properties: {
    artifactId: { type: 'string', description: 'Recorded artifact id' },
    sessionId: {
      type: 'string',
      description: 'Echo of the sessionId handle used for this tell. Reuse on further tells in this session.',
    },
  },
};

export const INTERVIEW_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    sessionId: {
      type: 'string',
      description: 'Echo of the interview sessionId handle when one was passed.',
    },
    done: { type: 'boolean', description: 'True when the draft was queued for implementation.' },
  },
};
