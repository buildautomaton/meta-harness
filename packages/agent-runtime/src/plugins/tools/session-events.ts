import type { AgentRuntimeManager } from '../../runtime/core/manager/types.js';
import type { SessionHooks } from '../../types/session/hooks.js';
import type { ToolsHooks } from '../../types/tools/hooks.js';
import type { SessionImplementation } from '../../types/session/implementation.js';
import type { SessionEvent } from '../../types/session/records.js';
import { isoNow } from '../../runtime/core/iso-now.js';
import { defaultAllowPermission } from './default-permission.js';

export type SessionEventHost = {
  backend: SessionImplementation;
  manager?: AgentRuntimeManager;
  sessionHooks?: SessionHooks;
  toolsHooks?: ToolsHooks;
};

export async function appendSessionEvent(
  options: SessionEventHost,
  sessionId: string,
  kind: SessionEvent['kind'],
  payload: unknown,
): Promise<void> {
  const event: SessionEvent = { ts: isoNow(), kind, payload };
  await options.backend.append(sessionId, event);
  const snapshot = await options.backend.get(sessionId);
  if (snapshot) options.sessionHooks?.onSessionEvent?.(sessionId, event, snapshot);
}

export async function finishSession(
  options: SessionEventHost,
  sessionId: string,
  result: { success: boolean; error?: string },
): Promise<void> {
  await options.backend.patch(sessionId, {
    status: result.success ? 'completed' : 'failed',
    error: result.error,
  });
  await appendSessionEvent(options, sessionId, 'result', result);
  const snapshot = await options.backend.get(sessionId);
  if (snapshot) options.sessionHooks?.onSessionComplete?.(snapshot);
}

export async function handleAgentRequest(
  options: SessionEventHost,
  sessionId: string,
  payload: unknown,
): Promise<void> {
  await appendSessionEvent(options, sessionId, 'request', payload);
  const rec = payload as { requestId?: string; method?: string; params?: Record<string, unknown> };
  if (typeof rec.requestId !== 'string' || !options.manager) return;
  const result = options.toolsHooks?.resolvePermission
    ? await options.toolsHooks.resolvePermission({
        requestId: rec.requestId,
        method: typeof rec.method === 'string' ? rec.method : '',
        params: rec.params ?? {},
      })
    : defaultAllowPermission(rec.params);
  options.manager.resolveRequest(rec.requestId, result);
}
