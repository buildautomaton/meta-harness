import type { SessionBackend, SessionBackendWrap } from '@runtime/session/types.js';
import type { WorkBackend, WorkBackendWrap, WorkImplementation } from '@/types/work/implementation.js';

export function wrapBackend(base: SessionBackend, wraps: SessionBackendWrap[]): SessionBackend {
  return wraps.reduce((current, wrap) => wrap(current), base);
}

export function wrapWorks(
  works: Record<string, WorkBackend>,
  wraps: WorkBackendWrap[],
): Record<string, WorkBackend> {
  const out: Record<string, WorkBackend> = {};
  for (const [name, base] of Object.entries(works)) {
    const wrapped = wraps.reduce<WorkImplementation>((current, wrap) => wrap(current), base);
    out[name] = { ...wrapped, id: base.id };
  }
  return out;
}
