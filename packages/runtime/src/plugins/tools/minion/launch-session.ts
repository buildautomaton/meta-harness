import { randomUUID } from 'node:crypto';
import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { LaunchAgentParams, SessionRecord } from '@/types/session/records.js';
import { isoNow } from '@runtime/core/iso-now.js';
import { emitMinionEvent } from './emit-progress.js';
import { wirePrompt } from './run-prompt.js';
import type { SessionEventHost } from './session-events.js';

export async function launchSession(
  options: SessionEventHost & {
    engine: AcpEngine;
    cwd: string;
    params: LaunchAgentParams;
  },
): Promise<{ sessionId: string }> {
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
  emitMinionEvent(options.notifier, {
    minionId: sessionId,
    type: 'progress',
    message: `Minion spawned (${record.harness}) in ${record.cwd}`,
    payload: { status: 'running', harness: record.harness, cwd: record.cwd },
  });
  wirePrompt({ ...options, record, params: prepared });
  return { sessionId };
}
