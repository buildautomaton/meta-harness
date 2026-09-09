import { localAgentErrorSuggestsAuth } from '../auth/local-agent-auth.js';

export function augmentPromptResultAuthFields(
  agentType: string | null | undefined,
  errorText: string | undefined
): Record<string, unknown> {
  const err = errorText ?? '';
  const at = agentType ?? null;
  const evaluated = Boolean(at && err.trim());
  const suggestsAuth = evaluated && at ? localAgentErrorSuggestsAuth(at, err) : false;
  if (!suggestsAuth || !agentType) return {};
  return { agentAuthRequired: true, agentType };
}
