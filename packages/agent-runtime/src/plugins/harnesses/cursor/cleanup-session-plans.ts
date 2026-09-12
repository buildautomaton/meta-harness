import * as fs from 'node:fs';
import { getSessionPlansDir } from '../../../runtime/core/util/session-plans-paths.js';

/** Remove `agent-runtime plans dir/<sessionId>/` after a turn ends or the session is discarded. */
export function cleanupSessionPlans(sessionId: string | undefined | null): void {
  const id = typeof sessionId === 'string' ? sessionId.trim() : '';
  if (!id) return;
  const dir = getSessionPlansDir(id);
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore missing or busy dirs */
  }
}
