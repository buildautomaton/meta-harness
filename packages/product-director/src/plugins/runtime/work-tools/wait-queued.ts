import type { WorkImplementation } from '@/types/work/implementation.js';
import type { WorkItem } from '@/types/work/records.js';

/** Block until there is queued work or an unpaused draft to interview. */
export async function waitUntilQueuedOrDraft(work: WorkImplementation): Promise<void> {
  for (;;) {
    if ((await hasQueued(work)) || (await listDrafts(work)).length > 0) return;
    await onceWorkChanged(work);
  }
}

export async function hasQueued(work: WorkImplementation): Promise<boolean> {
  const queued = await work.listWork({ status: 'queued' });
  return queued.some((item) => !item.paused);
}

export async function listDrafts(work: WorkImplementation): Promise<WorkItem[]> {
  return (await work.listWork({ status: 'draft' })).filter((item) => !item.paused);
}

function onceWorkChanged(work: WorkImplementation): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      unsub();
      resolve();
    };
    const unsub = work.subscribe(() => finish());
    void Promise.all([hasQueued(work), listDrafts(work)]).then(([queued, drafts]) => {
      if (queued || drafts.length > 0) finish();
    });
  });
}
