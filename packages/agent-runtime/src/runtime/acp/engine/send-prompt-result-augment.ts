import { localAgentErrorSuggestsAuth } from '@runtime/harnesses/auth/local-agent-auth.js';

export function augmentPromptResultAuthFields(
  hints: readonly RegExp[] | undefined,
  errorText: string | undefined,
  agentType: string | null | undefined,
): Record<string, unknown> {
  const err = errorText ?? '';
  const suggestsAuth = localAgentErrorSuggestsAuth(hints, err);
  if (!suggestsAuth || !agentType) return {};
  return { agentAuthRequired: true, agentType };
}
