import type { MinionEvent, NotifierHub } from '@/types/notify.js';

const INTERVAL_MS = 2000;
const lastProgress = new Map<string, number>();

export function emitMinionEvent(notifier: NotifierHub | undefined, event: MinionEvent): void {
  notifier?.notify(event);
}

export function maybeProgressNotify(
  notifier: NotifierHub | undefined,
  minionId: string,
  message: string,
  payload?: unknown,
): void {
  if (!notifier) return;
  const now = Date.now();
  if ((lastProgress.get(minionId) ?? 0) + INTERVAL_MS > now) return;
  lastProgress.set(minionId, now);
  notifier.notify({ minionId, type: 'progress', message, payload });
}
