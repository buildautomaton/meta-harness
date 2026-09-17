import type { CommandHost } from '@/types/transport/implementation.js';
import type { LogFn } from '@/types/log.js';
import type { HostTransport } from '@runtime/transport/types.js';
import { logToStderr } from '@plugins/transport/shared/log-to-stderr.js';
import { handleMcpMethod } from '@plugins/transport/http/methods.js';
import { parseRpcJson, type JsonRpcMessage } from '@plugins/transport/http/jsonrpc.js';
import { encodeStdioMessage, pullStdioMessage } from './framing.js';
import { stdioNotifierSink } from './notify-sink.js';

/** MCP JSON-RPC over stdio. Tools only — work mounts are HTTP. */
export function createStdioTransport(log: LogFn = logToStderr): HostTransport {
  let stopped = false;
  let unsub: (() => void) | undefined;
  return {
    id: 'stdio',
    async start(host: CommandHost) {
      log('[stdio] MCP on stdin/stdout');
      unsub = host.notifier?.subscribe(stdioNotifierSink(writeNote));
      const initialized = { value: false };
      let buf: Buffer = Buffer.alloc(0);
      for await (const chunk of process.stdin) {
        if (stopped) break;
        const piece = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        buf = Buffer.concat([buf, piece]);
        buf = await drain(buf, host, initialized, log);
      }
    },
    async stop() {
      stopped = true;
      unsub?.();
      process.stdin.pause();
    },
  };
}

async function drain(
  buf: Buffer,
  host: CommandHost,
  initialized: { value: boolean },
  log: LogFn,
): Promise<Buffer> {
  let rest = buf;
  for (;;) {
    const pulled = pullStdioMessage(rest);
    if (!pulled) return rest;
    rest = pulled.rest;
    const msg = parseRpcJson(pulled.message);
    if (!msg) continue;
    const reply = await handleMcpMethod(msg, host, initialized, log, undefined, writeNote);
    if (reply) process.stdout.write(encodeStdioMessage(JSON.stringify(reply)));
  }
}

function writeNote(note: JsonRpcMessage): void {
  process.stdout.write(encodeStdioMessage(JSON.stringify(note)));
}
