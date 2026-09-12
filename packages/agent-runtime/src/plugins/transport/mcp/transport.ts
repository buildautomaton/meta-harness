import * as readline from 'node:readline';
import type { HostTransport } from '../../../runtime/transport/types.js';
import { handleMcpMethod } from './methods.js';
import { parseRpcLine } from './jsonrpc-stdio.js';

/** JSON-RPC MCP server over stdin/stdout (newline-delimited). */
export function createMcpTransport(): HostTransport {
  let rl: readline.Interface | undefined;
  return {
    id: 'mcp',
    async start(host) {
      rl = readline.createInterface({ input: process.stdin, terminal: false });
      const initialized = { value: false };
      for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const msg = parseRpcLine(trimmed);
        if (!msg) continue;
        await handleMcpMethod(msg, host, initialized);
      }
    },
    stop() {
      rl?.close();
    },
  };
}
