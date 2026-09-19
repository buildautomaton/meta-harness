import type { MinionEvent, NotifierHub } from '@/types/notify.js';
import type { SessionStatusResult } from '@/types/session/records.js';
import type { ToolCallExtras } from '@/types/tools/implementation.js';
import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import { compactSessionLog } from '@plugins/session/compact-log.js';
import type { PendingStore } from './pending-store.js';
import { minionProgressSummary } from './progress-summary.js';
import { getSessionStatus } from './session-status.js';

const POLL_MS = 400;
const PROGRESS_MS = 10_000;

export async function waitForMinion(options: {
  backend: SessionImplementation;
  pending: PendingStore;
  engine?: AcpEngine;
  notifier?: NotifierHub;
  minionId: string;
  extras?: ToolCallExtras;
}): Promise<SessionStatusResult | null> {
  const { backend, pending, engine, notifier, minionId, extras } = options;
  let progress = 0;
  let settled = false;
  let lastReport = 0;
  const tick = async (force: boolean) => {
    if (settled) return null;
    const status = await getSessionStatus(backend, minionId, pending.list(minionId), engine);
    if (settled) return null;
    const now = Date.now();
    if (status && !isSettled(status) && (force || lastReport === 0 || now - lastReport >= PROGRESS_MS)) {
      lastReport = now;
      progress += 1;
      extras?.reportProgress?.({ message: await summary(backend, pending, minionId), progress });
    }
    return status;
  };
  const first = await tick(true);
  if (!first || isSettled(first)) return first;
  return new Promise((resolve) => {
    const finish = (result: SessionStatusResult | null) => {
      if (settled) return;
      settled = true;
      clearInterval(timer);
      unsub?.();
      resolve(result);
    };
    const onEvent = (event: MinionEvent) => {
      if (event.minionId !== minionId) return;
      void tick(event.type !== 'progress').then((status) => {
        if (status && isSettled(status)) finish(status);
      });
    };
    const unsub = notifier?.subscribe({ notify: onEvent });
    const timer = setInterval(() => {
      void tick(false).then((status) => {
        if (status && isSettled(status)) finish(status);
      });
    }, POLL_MS);
  });
}

async function summary(backend: SessionImplementation, pending: PendingStore, minionId: string): Promise<string> {
  const snapshot = await backend.get(minionId);
  return minionProgressSummary(compactSessionLog(snapshot?.events ?? []), pending.list(minionId));
}

function isSettled(status: SessionStatusResult): boolean {
  return status.status !== 'running';
}
