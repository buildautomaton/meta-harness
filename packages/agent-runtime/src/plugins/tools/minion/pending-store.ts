import type { MinionAsk, MinionPendingRequest } from '@/types/notify.js';

type Entry = MinionAsk & { resolve: (result: unknown) => void };

export type PendingStore = {
  add(req: MinionAsk): Promise<unknown>;
  list(minionId: string): MinionPendingRequest[];
  complete(requestId: string, result: unknown): boolean;
  denyAll(minionId: string, result: unknown): void;
};

export function createPendingStore(): PendingStore {
  const map = new Map<string, Entry>();
  return {
    add(req) {
      return new Promise((resolve) => {
        map.set(req.requestId, { ...req, resolve });
      });
    },
    list(minionId) {
      return [...map.values()]
        .filter((entry) => entry.minionId === minionId)
        .map(({ resolve: _resolve, minionId: _id, ...rest }) => rest);
    },
    complete(requestId, result) {
      const entry = map.get(requestId);
      if (!entry) return false;
      map.delete(requestId);
      entry.resolve(result);
      return true;
    },
    denyAll(minionId, result) {
      for (const [id, entry] of map) {
        if (entry.minionId !== minionId) continue;
        map.delete(id);
        entry.resolve(result);
      }
    },
  };
}
