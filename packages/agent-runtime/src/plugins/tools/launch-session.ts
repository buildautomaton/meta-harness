import { randomUUID } from 'node:crypto';
import type { AgentRuntimeManager } from '../../runtime/core/manager/types.js';
import type { SessionHooks } from '../../types/session/hooks.js';
import type { ToolsHooks } from '../../types/tools/hooks.js';
import type { LaunchAgentParams, SessionRecord } from '../../types/session/records.js';
import type { SessionImplementation } from '../../types/session/implementation.js';
import { isoNow } from '../../runtime/core/iso-now.js';
import { wirePrompt } from './run-prompt.js';

export async function launchSession(options: {
  manager: AgentRuntimeManager;
  backend: SessionImplementation;
  cwd: string;
  params: LaunchAgentParams;
  sessionHooks?: SessionHooks;
  toolsHooks?: ToolsHooks;
}): Promise<{ sessionId: string }> {
  const prepared = (await options.toolsHooks?.prepareLaunch?.(options.params)) ?? options.params;
  const sessionId = randomUUID();
  const now = isoNow();
  const record: SessionRecord = {
    id: sessionId,
    harness: prepared.harness,
    model: prepared.model,
    prompt: prepared.prompt,
    cwd: prepared.cwd ?? options.cwd,
    status: 'running',
    runId: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await options.backend.create(record);
  wirePrompt({ ...options, record, params: prepared });
  return { sessionId };
}
