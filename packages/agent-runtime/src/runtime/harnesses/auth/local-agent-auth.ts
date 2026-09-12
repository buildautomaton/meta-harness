import { getAgentHarness } from '../registry.js';

/** Auth-error hint lookup. Hints live on each registered agent harness. */
export function localAgentErrorSuggestsAuth(
  agentType: string | undefined | null,
  errorText: string | undefined | null,
): boolean {
  if (agentType == null || agentType === '' || errorText == null || !String(errorText).trim()) {
    return false;
  }
  const hints = getAgentHarness(agentType)?.authErrorHints;
  if (!hints?.length) return false;
  return hints.some((re) => re.test(String(errorText)));
}
