import type { SessionBackend, SessionBackendWrap } from '@runtime/session/types.js';

export function wrapBackend(base: SessionBackend, wraps: SessionBackendWrap[]): SessionBackend {
  return wraps.reduce((current, wrap) => wrap(current), base);
}
