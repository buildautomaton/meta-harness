import { isCommandOnPath } from '../../clients/detect-command-on-path.js';

/** Backend `type` for bridge local agents (align with UI and `resolve-agent-command`). */
export const BACKEND_LOCAL_AGENT_TYPE = 'cursor-cli' as const;

export async function detectLocalAgentPresence(): Promise<boolean> {
  return isCommandOnPath('agent');
}
