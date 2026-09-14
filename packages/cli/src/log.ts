import type { LogFn } from '@buildautomaton/agent-runtime';

/** Always-on stderr (MCP stdout is JSON-RPC). */
export function writeInfo(line: string): void {
  process.stderr.write(`${line}\n`);
}

export function createLog(verbose: boolean): LogFn {
  return (line) => {
    if (verbose) writeInfo(line);
  };
}
