import type { LogFn } from '@buildautomaton/agent-runtime';

export function createLog(verbose: boolean): LogFn {
  return (line) => {
    if (verbose) process.stderr.write(`${line}\n`);
  };
}
