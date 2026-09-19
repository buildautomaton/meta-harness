import type { MinionEvent, NotifierHub } from '@/types/notify.js';

export function emitMinionEvent(notifier: NotifierHub | undefined, event: MinionEvent): void {
  notifier?.notify(event);
}
