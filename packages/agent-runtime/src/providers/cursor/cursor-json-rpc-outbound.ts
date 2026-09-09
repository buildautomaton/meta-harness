export type OutboundJsonRpcWaiter = {
  resolve: (value: unknown) => void;
  reject: (err: unknown) => void;
};

export function createCursorJsonRpcOutboundPending() {
  const pending = new Map<number, OutboundJsonRpcWaiter>();
  let nextId = 1;

  function allocateId(): number {
    return nextId++;
  }

  function register(id: number, waiter: OutboundJsonRpcWaiter): void {
    pending.set(id, waiter);
  }

  function settleResponse(id: number, msg: Record<string, unknown>): boolean {
    const waiter = pending.get(id);
    if (!waiter) return false;
    pending.delete(id);
    if (msg.error) waiter.reject(msg.error);
    else waiter.resolve(msg.result);
    return true;
  }

  function rejectOnWriteError(id: number, err: unknown): void {
    const waiter = pending.get(id);
    pending.delete(id);
    waiter?.reject(err);
  }

  return { allocateId, register, settleResponse, rejectOnWriteError };
}
