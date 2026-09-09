import * as os from 'node:os';
import * as path from 'node:path';

/**
 * Local plan files keyed by ACP session id.
 * Override via AGENT_RUNTIME_PLANS_DIR if the host wants a custom root.
 */
export function getSessionPlansRootDir(): string {
  const override = process.env.AGENT_RUNTIME_PLANS_DIR?.trim();
  if (override) return path.resolve(override);
  return path.join(os.tmpdir(), 'agent-runtime-plans');
}

export function sanitizeSessionPlansKey(sessionId: string): string {
  const t = sessionId.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 220);
  return t || 'session';
}

/** Plans directory for one ACP session id. */
export function getSessionPlansDir(acpSessionId: string): string {
  return path.join(getSessionPlansRootDir(), sanitizeSessionPlansKey(acpSessionId));
}
