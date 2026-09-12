import type { McpToolDefinition } from '../../types/tools/definitions.js';
import { GET_SESSION_TOOL, LAUNCH_SUBAGENT_TOOL } from './names.js';

export const LAUNCH_SUBAGENT_DEFINITION: McpToolDefinition = {
  name: LAUNCH_SUBAGENT_TOOL,
  description:
    'Launch a local coding subagent with a harness, optional model, and prompt. Runs in the runtime working directory. Returns a session ID.',
  inputSchema: {
    type: 'object',
    properties: {
      harness: {
        type: 'string',
        description: 'Agent harness type (e.g. cursor-cli, claude-code, codex-acp).',
      },
      model: { type: 'string', description: 'Optional model id for the harness.' },
      prompt: { type: 'string', description: 'Prompt to send to the subagent.' },
    },
    required: ['harness', 'prompt'],
  },
};

export const GET_SESSION_DEFINITION: McpToolDefinition = {
  name: GET_SESSION_TOOL,
  description:
    'Get the status of a runtime session by ID, including a summary of the last portion of the transcript.',
  inputSchema: {
    type: 'object',
    properties: {
      sessionId: { type: 'string', description: 'Session ID returned by launch_subagent.' },
    },
    required: ['sessionId'],
  },
};

export const CORE_TOOL_DEFINITIONS: McpToolDefinition[] = [
  LAUNCH_SUBAGENT_DEFINITION,
  GET_SESSION_DEFINITION,
];
