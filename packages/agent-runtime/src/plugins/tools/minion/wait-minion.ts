import type { MinionEvent, NotifierHub } from '@/types/notify.js';
import type { SessionStatusResult } from '@/types/session/records.js';
import type { ToolCallExtras } from '@/types/tools/implementation.js';
import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { PendingStore } from './pending-store.js';
import { getSessionStatus } from './session-status.js';

const POLL_MS = 400;

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
  const tick = async (message: string) => {
    if (settled) return null;
    const status = await getSessionStatus(backend, minionId, pending.list(minionId), engine);
    if (settled) return null;
    if (status && !isSettled(status)) {
      progress += 1;
      extras?.reportProgress?.({ message, progress });
    }
    return status;
  };
  const first = await tick('Waiting for minion');
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
      void tick(event.message).then((status) => {
        if (status && isSettled(status)) finish(status);
      });
    };
    const unsub = notifier?.subscribe({ notify: onEvent });
    const timer = setInterval(() => {
      void tick('Minion still running').then((status) => {
        if (status && isSettled(status)) finish(status);
      });
    }, POLL_MS);
  });
}

function isSettled(status: SessionStatusResult): boolean {
  return status.status !== 'running' || Boolean(status.needsUser) || status.pendingRequests.length > 0;
}
