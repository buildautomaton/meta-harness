/** Optional host shutdown check; defaults to never shutting down. */
let shutdownRequested: () => boolean = () => false;

export function setShutdownRequestedCheck(fn: () => boolean): void {
  shutdownRequested = fn;
}

export function isShutdownRequested(): boolean {
  return shutdownRequested();
}

export async function delayMsUnlessShutdownRequested(ms: number): Promise<boolean> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (isShutdownRequested()) return false;
    await new Promise((r) => setTimeout(r, Math.min(50, end - Date.now())));
  }
  return !isShutdownRequested();
}
