import type { RemoteCommand, RemoteTransportImplementation } from '../../../types/transport/options.js';

/**
 * POST `{ type: 'register' }` to the URL, then poll `{url}/commands`.
 */
export function createHttpRemoteAdapter(url: string): RemoteTransportImplementation {
  const base = url.replace(/\/$/, '');
  let abort: AbortController | undefined;
  return {
    async register(info) {
      const res = await fetch(`${base}/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'register', ...info }),
      });
      if (!res.ok) throw new Error(`Remote register failed: ${res.status}`);
    },
    async subscribe(handler) {
      abort = new AbortController();
      void pollCommands(base, handler, abort.signal);
    },
    unsubscribe() {
      abort?.abort();
    },
  };
}

async function pollCommands(
  base: string,
  handler: (cmd: RemoteCommand) => Promise<unknown>,
  signal: AbortSignal,
): Promise<void> {
  while (!signal.aborted) {
    try {
      const res = await fetch(`${base}/commands`, { signal });
      if (!res.ok) {
        await sleep(1000, signal);
        continue;
      }
      const cmd = (await res.json()) as RemoteCommand;
      if (cmd?.id) {
        const result = await handler(cmd);
        await fetch(`${base}/results`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: cmd.id, result }),
        });
      } else {
        await sleep(500, signal);
      }
    } catch {
      if (signal.aborted) return;
      await sleep(1000, signal);
    }
  }
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(t);
      resolve();
    });
  });
}
