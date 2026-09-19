import { claudeCodeAuthErrorHints } from './claude-code/auth.js';
import { codexAuthErrorHints } from './codex/auth.js';
import { cursorAuthErrorHints } from './cursor/auth.js';
import { kiroAuthErrorHints } from './kiro/auth.js';

const AUTH_ERROR_HINTS: Record<string, readonly RegExp[]> = {
  'claude-code': claudeCodeAuthErrorHints,
  'codex-acp': codexAuthErrorHints,
  'cursor-cli': cursorAuthErrorHints,
  'kiro-acp': kiroAuthErrorHints,
};

export function localAgentErrorSuggestsAuth(
  agentType: string | undefined | null,
  errorText: string | undefined | null,
): boolean {
  if (agentType == null || agentType === '' || errorText == null || !String(errorText).trim()) return false;
  const hints = AUTH_ERROR_HINTS[agentType];
  if (!hints?.length) return false;
  return hints.some((re) => re.test(String(errorText)));
}
