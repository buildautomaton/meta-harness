/**
 * Resolves after the current stack clears so other I/O, timers, and callbacks can run.
 */
export function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}
