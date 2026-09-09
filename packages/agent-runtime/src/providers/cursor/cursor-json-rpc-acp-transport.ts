/**
 * {@link AcpSessionTransport} backed by Cursor CLI JSON-RPC `send` + custom cancel notification.
 */

import type { AcpSessionTransport } from '../../clients/acp-session-transport.js';

export function createCursorJsonRpcAcpTransport(deps: {
  send: (method: string, params: Record<string, unknown>) => Promise<unknown>;
  cancelSessionNotification: (sessionId: string) => Promise<void>;
  skipBrowserAuthenticate?: boolean;
}): AcpSessionTransport {
  const { send, cancelSessionNotification, skipBrowserAuthenticate } = deps;
  return {
    initialize: (request) => send('initialize', request) as Promise<Record<string, unknown>>,
    afterInitialize: async () => {
      if (skipBrowserAuthenticate) return;
      await send('authenticate', { methodId: 'cursor_login' });
    },
    resumeSession: (p) => send('session/resume', p as Record<string, unknown>),
    loadSession: (p) => send('session/load', p as Record<string, unknown>),
    newSession: (p) => send('session/new', p as Record<string, unknown>),
    prompt: (p) => send('session/prompt', p as Record<string, unknown>),
    cancelSession: (sessionId) => cancelSessionNotification(sessionId),
    setSessionMode: (p) => send('session/set_mode', p as Record<string, unknown>),
  };
}
