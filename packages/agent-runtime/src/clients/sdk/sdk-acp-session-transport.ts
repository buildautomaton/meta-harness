/**
 * {@link AcpSessionTransport} backed by `@agentclientprotocol/sdk` `ClientSideConnection`.
 */

import type { AcpSessionTransport } from '../acp-session-transport.js';

type SdkConnectionLike = {
  initialize: (p: Record<string, unknown>) => Promise<unknown>;
  unstable_resumeSession: (p: unknown) => Promise<unknown>;
  loadSession: (p: unknown) => Promise<unknown>;
  newSession: (p: unknown) => Promise<unknown>;
  prompt: (p: unknown) => Promise<unknown>;
  cancel: (p: unknown) => Promise<void>;
  extMethod?: (method: string, params: Record<string, unknown>) => Promise<Record<string, unknown>>;
  setSessionConfigOption?: (p: unknown) => Promise<unknown>;
  setSessionMode?: (p: unknown) => Promise<unknown>;
};

/**
 * `ClientSideConnection` is loaded dynamically; SDK method parameter types are stricter than
 * `unknown`, so the factory accepts the runtime object and narrows internally.
 */
export function createSdkAcpSessionTransport(connection: unknown): AcpSessionTransport {
  const c = connection as SdkConnectionLike;
  return {
    initialize: (request) => c.initialize(request) as Promise<Record<string, unknown>>,
    resumeSession: (p) => c.unstable_resumeSession(p),
    loadSession: (p) => c.loadSession(p),
    newSession: (p) => c.newSession(p),
    prompt: (p) => c.prompt(p),
    cancelSession: async (sessionId) => {
      await c.cancel({ sessionId } as unknown);
    },
    closeSession: c.extMethod
      ? async (sessionId) => {
          await c.extMethod!('session/close', { sessionId });
        }
      : undefined,
    setSessionConfigOption: c.setSessionConfigOption ? (p) => c.setSessionConfigOption!(p) : undefined,
    setSessionMode: c.setSessionMode ? (p) => c.setSessionMode!(p) : undefined,
  };
}
